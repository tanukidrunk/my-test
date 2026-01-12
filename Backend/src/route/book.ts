import { Hono } from 'hono';
import { prisma } from '../prisma';
import { authMiddleware } from '../middleware/auth';
import { BookStatus } from "../../generated/prisma/client";
import { adminOnly } from '../middleware/adminOnly';

export const book = new Hono();

const apiResponse = (
  c: any,
  status: number,
  message: string,
  data: any = null,
  error: any = null
) => {
  return c.json({ status, message, data, error }, 200);
};

// GET all
book.get('/', async (c) => {
  const books = await prisma.book.findMany({
    include: { category: true },
  });
  return apiResponse(c, 200, "ok", books);
});

// GET by id
book.get('/:id', authMiddleware, async (c) => {
  const id = Number(c.req.param('id'));
  const book = await prisma.book.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!book) {
    return apiResponse(c, 404, "Book not found");
  }

  return apiResponse(c, 200, "ok", book);
});

// POST create
book.post('/', authMiddleware, adminOnly, async (c) => {
  const body = await c.req.json();

  const book = await prisma.book.create({
    data: {
      title: body.title,
      author: body.author,
      publication_year: body.publication_year,
      categoryId: body.categoryId,
    },
  });

  return apiResponse(c, 201, "Created", book);
});

// PUT update
book.put('/:id', authMiddleware, adminOnly, async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();

  const book = await prisma.book.update({
    where: { id },
    data: body,
  });

  return apiResponse(c, 200, "Updated", book);
});

// DELETE
book.delete('/:id', authMiddleware, adminOnly, async (c) => {
  const id = Number(c.req.param('id'));
  await prisma.book.delete({ where: { id } });

  return apiResponse(c, 200, "Deleted");
});
