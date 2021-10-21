import { isInteger } from 'lodash-es';
import log4js from 'log4js';
import { dirname, join as joinPath, resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';

export const root = dirname(fileURLToPath(import.meta.url));

export async function loadConfig() {
  await loadDotenv();

  const dbFile = resolvePath(root, parseEnvString('BANK_DB_FILE', 'db.loki'));
  const host = parseEnvString('BANK_LISTEN_HOST', '0.0.0.0');
  const port = parseEnvPort('BANK_LISTEN_PORT', 3000);

  function createLogger(category) {
    const logger = log4js.getLogger(category);
    logger.level = 'DEBUG';
    return logger;
  }

  return {
    // Paths
    dbFile,
    // Server
    host,
    port,
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
