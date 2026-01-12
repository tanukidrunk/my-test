export const adminOnly = async (c: any, next: any) => {
  const user = c.get("member");
  if (user.role !== "ADMIN") {
    return c.json({ message: "Forbidden" }, 403);
  }
  await next();
};
