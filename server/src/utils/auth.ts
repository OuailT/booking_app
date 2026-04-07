import { Role } from '../../generated/prisma';

// ─── Hardcoded Credentials ────────────────────────────────────────────────────
// These are intentionally simple for classroom demonstration purposes.

export interface AuthUser {
  userId: string;   // matches the seeded DB id
  role: Role;
  username: string;
}

/**
 * Hardcoded accounts used for login.
 * username → { password, userId (must match seed data), role }
 */
export const HARDCODED_USERS: Record<string, { password: string; userId: string; role: Role }> = {
  // Admin / Employer account
  admin: {
    password: 'admin123',
    userId: 'aaaaaaaa-0000-0000-0000-000000000001',
    role: Role.EMPLOYER,
  },
  // Employee account (shared password; userId picked up from the seeded employee)
  employee: {
    password: 'employee123',
    userId: 'bbbbbbbb-0000-0000-0000-000000000001',
    role: Role.EMPLOYEE,
  },
};

/**
 * Validates a Basic-Auth header value.
 * Returns the AuthUser on success, or null on failure.
 *
 * Header format:  Authorization: Basic base64(username:password)
 */
export function validateBasicAuth(authHeader: string | undefined): AuthUser | null {
  if (!authHeader || !authHeader.startsWith('Basic ')) return null;

  const base64Credentials = authHeader.slice('Basic '.length);
  let decoded: string;
  try {
    decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  } catch {
    return null;
  }

  const colonIndex = decoded.indexOf(':');
  if (colonIndex === -1) return null;

  const username = decoded.slice(0, colonIndex);
  const password = decoded.slice(colonIndex + 1);

  const account = HARDCODED_USERS[username];
  if (!account || account.password !== password) return null;

  return { userId: account.userId, role: account.role, username };
}
