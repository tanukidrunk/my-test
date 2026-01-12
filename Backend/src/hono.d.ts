import "hono";

declare module "hono" {
  interface ContextVariableMap {
    member: {
  memberId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
    };
  }
}
