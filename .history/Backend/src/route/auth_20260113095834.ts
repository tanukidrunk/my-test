import {Hono} from "hono";
import { authMiddleware } from "../middleware/auth";   

export const auth = new Hono();

const apiResponse = (
  c: any,
  status: number,
  message: string,
  data: any = null,
  error: any = null
) => {
  return c.json({ status, message, data, error }, 200);
};

auth.get("/me", authMiddleware, async (c) => {
    const member = c.get("member");
    return c.json({member});
});