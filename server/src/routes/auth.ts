import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { generateToken } from '../utils/jwt';

const router = Router();

const loginSchema = z.object({
  loginCode: z.string().min(1, 'Login code is required'),
});

// POST /auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { loginCode } = parsed.data;

  const user = await prisma.user.findUnique({ where: { loginCode } });
  if (!user) {
    res.status(401).json({ error: 'Invalid login code' });
    return;
  }

  const token = generateToken({ userId: user.id, role: user.role });
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

export default router;
