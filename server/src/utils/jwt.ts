import jwt from 'jsonwebtoken';
import { Role } from '../../generated/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-default-key-please-change';

export interface JwtPayload {
  userId: string;
  role: Role;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    return null;
  }
};
