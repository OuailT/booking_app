import { Request, Response, NextFunction } from 'express';

export const requireRole = (role: "EMPLOYER" | "EMPLOYEE") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.log("Error: user not authorized");
      return res.status(401).json({ message: "User is not authorized" });
    }

    if (req.user.role !== role) {
      console.log("Error: user role not authorized");
      return res.status(403).json({ message: "Role is not authorized" });
    }

    next();
  };
};