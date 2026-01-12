import {Hono} from "hono";
import { authMiddleware } from "../middleware/auth";   

export const auth = new Hono();

