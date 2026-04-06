import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { Role } from '../../generated/prisma';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  req.user = payload;
  next();
};

export const requireEmployer = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== Role.EMPLOYER) {
    res.status(403).json({ error: 'Access denied: Employer only' });
    return;
  }
  next();
};

export const requireEmployee = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== Role.EMPLOYEE) {
    res.status(403).json({ error: 'Access denied: Employee only' });
    return;
  }
  next();
};
