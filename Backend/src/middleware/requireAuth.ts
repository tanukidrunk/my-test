// import { sessionStore } from "../route/session"

// export const requireAuth = async (c: any, next: any) => {
//   const cookie = c.req.header("cookie")
//   const sessionId = cookie?.match(/session_id=([^;]+)/)?.[1]

//   if (!sessionId) return c.json({ message: "Unauthorized" }, 401)

//   const session = sessionStore.get(sessionId)
//   if (!session) return c.json({ message: "Session expired" }, 401)

//   c.set("user", session)
//   await next()
// }
