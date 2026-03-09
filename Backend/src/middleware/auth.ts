import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';


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

export type AppContext = Context<{ Variables: AppVariables }>;

export const apiResponse = (
  c: any,
  status: number,
  message: string,
  data: any = null,
  error: any = null,
) => {
  return c.json(
    {
      status,
      message,
      data,
      error,
    },
    status,
  );
}; 

export const authMiddleware = async (c: AppContext, next: Next) => {
  const authHeader = c.req.header('authorization');

  if (!authHeader) {
    return apiResponse(c, 401, 'Unauthorized');
  }

  if (!authHeader.startsWith('Bearer ')) {
    return apiResponse(c, 401, 'Invalid Authorization format');
  }

  const token = authHeader.slice(7);

try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JwtPayload;

    c.set('member', payload);

    await next();
  } catch {
    return apiResponse(c, 401, 'Invalid or expired token');
  }
};
  