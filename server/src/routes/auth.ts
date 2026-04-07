import { Router, Request, Response } from 'express';
import { validateBasicAuth } from '../utils/auth';

const router = Router();

/**
 * POST /auth/login
 *
 * Body: { "username": "admin", "password": "admin123" }
 *
 * Returns the user info on success.
 * For simple/classroom use — no tokens issued.
 */
router.post('/login', (req: Request, res: Response): void => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'username and password are required' });
    return;
  }

  // Build a Basic Auth header string so we can reuse validateBasicAuth
  const encoded = Buffer.from(`${username}:${password}`).toString('base64');
  const user = validateBasicAuth(`Basic ${encoded}`);

  if (!user) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  res.json({
    message: 'Login successful',
    user: {
      userId: user.userId,
      username: user.username,
      role: user.role,
    },
    // Remind the client how to authenticate subsequent requests
    auth_instructions: 'Send "Authorization: Basic base64(username:password)" on every request.',
  });
});

export default router;
