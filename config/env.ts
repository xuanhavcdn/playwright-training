import * as dotenv from 'dotenv';
import * as path from 'path';

// Load variables from the .env file at the project root into process.env.
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Reads a required environment variable, throwing early with a clear message
 * if it is missing so tests fail fast instead of acting on `undefined`.
 */
function required(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(
      `Missing required environment variable "${key}". ` +
        `Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
}

/** Centralised, typed access to all sensitive/config values. */
export const env = {
  ENV: process.env.ENV ?? 'staging',
  BASE_URL: required('BASE_URL'),
  USER_NAME: required('USER_NAME'),
  PASSWORD: required('PASSWORD'),
} as const;
