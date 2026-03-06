import { Context, Next } from 'hono';
import { AppContext,apiResponse } from './jwtauth';
export const adminOnly = async (c: AppContext, next: Next) => {
  const member = c.get("member");

  if (member.role !== "ADMIN") {
    return apiResponse(c, 403, "Forbidden");
  }

  await next();
};