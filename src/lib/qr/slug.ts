import { randomBytes } from 'crypto';

/**
 * Generates a cryptographically random 8-character base64url slug.
 * Uses 6 random bytes → 8 base64url characters (A-Z, a-z, 0-9, -, _).
 */
export function generateSlug(): string {
  return randomBytes(6).toString('base64url');
}
