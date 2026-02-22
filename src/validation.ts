/**
 * Input validation utilities for GAS backend.
 * Centralising validation ensures consistent sanitisation across all entry points.
 */

/** Maximum length for a todo title (characters). */
export const MAX_TITLE_LENGTH = 500;

/** UUID v4 regular expression. */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Returns true when `title` is a non-empty string within the allowed length.
 */
export function isValidTitle(title: unknown): title is string {
    return typeof title === 'string' && title.trim().length > 0 && title.length <= MAX_TITLE_LENGTH;
}

/**
 * Returns true when `id` is a valid UUID v4 string.
 * Accepting only UUIDs prevents injection of arbitrary property keys.
 */
export function isValidId(id: unknown): id is string {
    return typeof id === 'string' && UUID_REGEX.test(id);
}
