import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { getCookie } from 'hono/cookie'

const JWT_SECRET = process.env.JWT_SECRET!;

type JwtPayload = {
  memberId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}; 

type AppVariables = { 
  member: JwtPayload;
};

type AppContext = Context<{ Variables: AppVariables }>;

export const authMiddleware = async (c: AppContext, next: Next) => {
  const token = getCookie(c, 'accessToken');

  if (!token) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JwtPayload;
    c.set('member', payload);
    await next();
  } catch {
    return c.json({ message: 'Invalid or expired token' }, 401);
  }
};
  