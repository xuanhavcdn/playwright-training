import * as path from 'path';

/** Project root directory (one level up from config/). */
export const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * File where the authenticated browser session (cookies + localStorage)
 * is saved by the setup project and reused by the test projects.
 * Kept under playwright/.auth/ which is git-ignored.
 */
export const STORAGE_STATE = path.join(ROOT_DIR, 'playwright', '.auth', 'user.json');
