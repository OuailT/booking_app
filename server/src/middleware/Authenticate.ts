import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

// Extend Express Request interface to include user property
declare global { 
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'EMPLOYEE' | 'EMPLOYER';
      };
    }
  }
}


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // for now = user.id

  const user = await prisma.user.findUnique({
    where: { id: token },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid token" });
  }
  
  req.user = user; // Attach user info to request object for use in routes

  next();
};