import { Request, Response, NextFunction } from 'express';
import { validateBasicAuth, AuthUser } from '../utils/auth';
import { Role } from '../../generated/prisma';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const user = validateBasicAuth(authHeader);

  if (!user) {
    res.status(401).json({ error: 'Invalid or missing credentials. Use Basic Auth (username:password).' });
    return;
  }

  req.user = user;
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
