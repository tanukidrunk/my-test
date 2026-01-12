
import app from "./index"
Bun.serve({
  port: 3001,
  fetch: app.fetch
})
 
console.log("?? Hono API running on http://localhost:3001")
