import Loki from 'lokijs';

export function openDatabase(config) {
  return new Promise((resolve, reject) => {
    const db = new Loki(config.dbFile, {
      autoload: true,
      autoloadCallback: initializeDatabase,
      autosave: true,
      autosaveInterval: 0
    });

    const logger = config.createLogger('db');

    function initializeDatabase(err) {
      if (err) {
        return reject(err);
      }

      ensureCollection(db, 'users', logger);

      logger.debug(`Opened database file ${config.dbFile}`);
      resolve(db);
    }
  });
}

function ensureCollection(db, name, logger) {
  if (!db.getCollection(name)) {
    db.addCollection(name);
    logger.debug(`Created database collection ${name}`);
  }
}
