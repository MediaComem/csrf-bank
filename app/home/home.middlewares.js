import { compare } from 'bcrypt';
import { DateTime } from 'luxon';

import { route } from '../express.js';
import { getValidationErrors } from '../validation.js';

export const homePage = route((req, res) => {
  const { user } = req.session;

  const operations = user
    ? req.app
        .get('db')
        .getCollection('operations')
        .find({ user: { $eq: user.id } })
        .map(deserializeOperation)
        .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    : [];

  const balance = operations.reduce((memo, operation) => {
    switch (operation.type) {
      case 'credit':
        return memo + operation.amount;
      case 'transfer':
        return memo - operation.amount;
      default:
        return memo;
    }
  }, 0);

  res.render('home/home', {
    pageTitle: user ? undefined : 'Please log in',
    username: req.query.username ?? '',
    balance: balance.toLocaleString(),
    operations: operations.map(formatOperation)
  });
});

function deserializeOperation({ date, ...rest }) {
  return {
    ...rest,
    date: DateTime.fromISO(date)
  };
}

function formatOperation({ amount, date, ...rest }) {
  return {
    ...rest,
    amount: amount.toLocaleString(),
    date: date.toLocaleString(DateTime.DATETIME_MED)
  };
}

export const logIn = route(async (req, res) => {
  const errors = getValidationErrors(req.body, 'login');
  if (errors) {
    return invalidLogin(req, res, 'Login payload is invalid');
  }

  const { username, password } = req.body;
  req.logger.trace(`User ${JSON.stringify(username)} logging in`);

  const user = req.app
    .get('db')
    .getCollection('users')
    .findOne({ name: { $eq: username } });
  if (!user) {
    return invalidLogin(req, res, `User ${JSON.stringify(username)} not found`);
  }

  const passwordMatches = await compare(password, user.passwordHash);
  if (!passwordMatches) {
    return invalidLogin(
      req,
      res,
      `Password of user ${JSON.stringify(username)} does not match`
    );
  }

  req.logger.info(
    `User ${user.id} (${JSON.stringify(username)}) successfully logged in`
  );

  req.session.user = user;

  res.redirect('/');
});

function invalidLogin(req, res, logMessage) {
  req.logger.trace(logMessage);
  req.flash('warning', 'Username or password is invalid');
  res.redirect('/');
}

export const logOut = route((req, res) => {
  const { user } = req.session;

  if (user) {
    delete req.session.user;
    req.logger.info(
      `User ${user.id} (${JSON.stringify(user.name)}) logged out`
    );
  }

  res.redirect('/');
});
