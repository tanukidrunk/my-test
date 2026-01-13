import { Context, Next } from "hono";
import jwt from "jsonwebtoken";
 
 
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
  const authHeader = c.req.header("authorization");

  if (!authHeader) {
    return c.json({ message: "Missing Authorization header" }, 401);
  }

  if (!authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Invalid Authorization format" }, 401);
  }
 
  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as JwtPayload;
    c.set("member", decoded);
    await next();
  } catch {
    return c.json({ message: "Invalid or expired token" }, 401);
  }
};
