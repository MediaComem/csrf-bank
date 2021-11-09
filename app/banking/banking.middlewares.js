import { DateTime } from 'luxon';

import { route } from '../express.js';
import { getValidationErrors } from '../validation.js';

export const transfer = route(async (req, res) => {
  const { _csrf, ...body } = req.body;
  const data = {
    ...body,
    amount: coerceAmount(req.body.amount)
  };

  const errors = getValidationErrors(data, 'transfer');
  if (errors) {
    req.flash('warning', 'Transfer is invalid');
    return res.redirect('/');
  }

  const { amount, recipient } = data;
  const { user } = req.session;

  const transfer = {
    user: user.id,
    type: 'transfer',
    date: DateTime.now(),
    amount,
    recipient
  };

  await req.app
    .get('db')
    .getCollection('operations')
    .insert(serializeOperation(transfer));

  req.logger.info(
    `Successful transfer to ${JSON.stringify(recipient)} by user ${
      user.id
    } (${JSON.stringify(user.name)})`
  );

  req.flash('info', 'Transfer successful');

  res.redirect('/');
});

function coerceAmount(value) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? value : parsed;
}

function serializeOperation({ date, ...rest }) {
  return {
    ...rest,
    date: date.toISO()
  };
}
