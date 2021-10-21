import express from 'express';
import createError from 'http-errors';
import log4js from 'log4js';
import { join as joinPath } from 'path';

import { root } from './config.js';
import indexRouter from './routes/index.js';

export function createApplication(config, db) {
  const app = express();
  const logger = config.createLogger('app');

  app.set('db', db);
  app.set('port', config.port);

  // Use https://pugjs.org for templates.
  app.set('views', joinPath(root, 'views'));
  app.set('view engine', 'pug');

  app.use(log4js.connectLogger(logger, { level: 'DEBUG' }));
  app.use(express.urlencoded({ extended: false }));

  // Serve static files from the public directory.
  app.use(express.static(joinPath(root, 'public')));

  // Plug in application routes.
  app.use('/', indexRouter);

  // Catch 404 and forward to the global error handler.
  app.use((req, res, next) => {
    next(createError(404));
  });

  // Global error handler
  app.use((err, req, res, next) => {
    // Set locals, only providing error in development.
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page.
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
}
