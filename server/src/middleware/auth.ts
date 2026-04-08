import { Request, Response, NextFunction } from 'express';
import { Role } from '../../generated/prisma';
import { prisma } from '../index';

export interface AuthUser {
  userId: string;
  role: Role;
  name: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    res.status(401).json({ error: 'Invalid or missing credentials. Use Authorization: <loginCode>.' });
    return;
  }

  const loginCode = authHeader.replace(/^Bearer\s+/, '').trim();

  try {
    const user = await prisma.user.findUnique({ where: { loginCode } });

    if (!user) {
      res.status(401).json({ error: 'Invalid or missing credentials. Use Authorization: <loginCode>.' });
      return;
    }

    req.user = {
      userId: user.id,
      role: user.role,
      name: user.name
    };
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
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
