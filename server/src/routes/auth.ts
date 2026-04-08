import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

/**
 * POST /auth/login
 *
 * Body: { "loginCode": "ADMIN-001" }
 *
*/
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { loginCode } = req.body;

  if (!loginCode) {
    res.status(400).json({ error: 'loginCode is required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { loginCode } });

    if (!user) {
      res.status(401).json({ error: 'Invalid loginCode' });
      return;
    }

    res.json({
      message: 'Login successful',
      user: {
        userId: user.id,
        name: user.name,
        role: user.role,
        position: user.position
      },
      // Remind the client how to authenticate subsequent requests
      auth_instructions: 'Send "Authorization: <loginCode>" on every request.',
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
