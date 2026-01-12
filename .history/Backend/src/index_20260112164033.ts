import "dotenv/config";
import { Hono } from 'hono';
import {book}from "./route/book";
import {mem}from "./route/member";
import {borr}from "./route/borrow";
import {cate} from "./route/category";
import {auth} from "./route/auth";
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/auth';

const app = new Hono()

app.use(
  '*',
  cors({
    origin: 'http://localhost:3000', 
    credentials: true,
  })
)

app.get('/', (c) => c.text('API is running'))

app.get('/hello/:name', (c) => {
  const name = c.req.param('name')
  return c.json({ message: `Hello ${name}` })
})

app.route("/book", book);
app.route("/borrow", borr);
app.route("/member", mem);
app.route("/cate", cate);
app.route()

export default app
