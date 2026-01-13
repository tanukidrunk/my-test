import {Hono} from "hono";
import { authMiddleware } from "../middleware/auth";   

export const auth = new Hono();



auth.get("/me", authMiddleware, async (c) => {
    const member = c.get("member");
    return c.json({member});
});