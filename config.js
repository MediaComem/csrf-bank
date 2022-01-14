import { isInteger } from 'lodash-es';
import log4js from 'log4js';
import { dirname, resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';

export const logLevels = ['FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];
export const root = dirname(fileURLToPath(import.meta.url));

export async function loadConfig() {
  await loadDotenv();

  const env = process.env.NODE_ENV ?? 'development';

  const dbFile = resolvePath(root, parseEnvString('BANK_DB_FILE', 'db.loki'));
  const sessionsDir = resolvePath(
    root,
    parseEnvString('BANK_SESSIONS_DIR', 'sessions')
  );

  const host = parseEnvString('BANK_LISTEN_HOST', '0.0.0.0');
  const port = parseEnvPort('BANK_LISTEN_PORT', 3000);

  const logLevel = parseEnvEnum(
    'BANK_LOG_LEVEL',
    logLevels,
    env === 'production' ? 'DEBUG' : 'TRACE',
    value => value.toUpperCase()
  );

  const bcryptRounds = parseEnvInt('BANK_BCRYPT_ROUNDS', 10, 1);
  const sessionLifetime = parseEnvInt(
    'BANK_SESSION_LIFETIME',
    // 1 day in milliseconds
    1_000 * 60 * 60 * 24,
    1
  );
  const sessionSecret = parseEnvString('BANK_SESSION_SECRET');
  const trustProxy = parseEnvBoolean('BANK_TRUST_PROXY', env === 'production');

  const title = parseEnvString('BANK_TITLE', 'Carl Sagan Richard Feynman Bank');

  function createLogger(category) {
    const logger = log4js.getLogger(category);
    logger.level = logLevel;
    return logger;
  }

  const logger = createLogger('config');
  logger.info(`Environment: ${env}`);
  logger.info(`Log level: ${logLevel}`);
  logger.debug(
    `Session lifetime: ${sessionLifetime / (1_000 * 60 * 60)} hours`
  );
  logger.debug(`Trust proxy: ${trustProxy}`);

  return {
    // Paths
    dbFile,
    sessionsDir,
    // Environment,
    env,
    // Server
    host,
    port,
    // Security
    bcryptRounds,
    sessionLifetime,
    sessionSecret,
    trustProxy,
    // Other
    title,
    // Functions
    createLogger
  };
}

async function loadDotenv() {
  let dotenv;
  try {
    dotenv = await import('dotenv');
  } catch (err) {
    // Ignore
  }

  if (dotenv) {
    dotenv.config();
  }
}

function getEnvString(varName, required = true) {
  const value = process.env[varName];
  if (required && value === undefined) {
    throw new Error(`$${varName} is required`);
  }

  return value;
}

function parseEnvBoolean(varName, defaultValue) {
  const value = getEnvString(varName, defaultValue === undefined);
  if (value === undefined) {
    return defaultValue;
  }

  if (/^(?:1|y|yes|t|true)$/u.exec(value)) {
    return true;
  } else if (/^(?:0|n|no|f|false)$/u.exec(value)) {
    return false;
  } else {
    throw new Error(
      `$${varName} must be a boolean, but its value is ${JSON.stringify(value)}`
    );
  }
}

function parseEnvEnum(varName, allowedValues, defaultValue, coerce) {
  const value = getEnvString(varName, defaultValue === undefined);
  if (value === undefined) {
    return defaultValue;
  }

  const coerced = coerce(value);
  if (!allowedValues.includes(coerced)) {
    throw new Error(
      `$${varName} must be one of ${allowedValues
        .map(allowed => JSON.stringify(allowed))
        .join(', ')}, but its value is ${JSON.stringify(coerced)}`
    );
  }

  return coerced;
}

function parseEnvInt(varName, defaultValue, min, max) {
  const value = getEnvString(varName, defaultValue === undefined);
  if (value === undefined) {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);
  if (
    !isInteger(parsed) ||
    (min !== undefined && value < min) ||
    (max !== undefined && value > max)
  ) {
    throw new Error(
      `$${varName} must be an integer between ${min ?? '-Infinity'} and ${
        max ?? 'Infinity'
      }, but its value is ${JSON.stringify(value)}`
    );
  }

  return parsed;
}

function parseEnvPort(varName, defaultValue) {
  return parseEnvInt(varName, defaultValue, 1, 65_535);
}

function parseEnvString(varName, defaultValue) {
  const value = getEnvString(varName, defaultValue === undefined);
  return value ?? defaultValue;
}
