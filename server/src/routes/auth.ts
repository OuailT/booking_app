import { Router, Request, Response, response } from 'express';
import { z } from 'zod';
import { prisma } from '../index';

const router = Router();

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});


router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);// Validate request body against the schema
  if (!parsed.success) {
    // If validation fails, return bad request with error details
    res.status(400).json({ error: z.treeifyError(parsed.error) });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { email, password },
    select: { id: true, name: true, role: true },
  });

  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

   const token = user.id; //Simple token using user Id

res.json({
  token,
  user,
});
  // Return user info  on successful login
  /* 
  "token": "user-id-123",
  "user": {
    "id": "user-id-123",
    "email": "admin@company.com",
    "role": "EMPLOYER"
  }*/
});

export default router;