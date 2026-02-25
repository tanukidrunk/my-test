import { Hono } from 'hono';
import { prisma } from '../prisma';
import { authMiddleware } from '../middleware/auth';
import { BookStatus } from '../../generated/prisma/client';
import { adminOnly } from '../middleware/adminOnly';
import { randomUUID } from 'crypto';

export const book = new Hono();

const apiResponse = (
  c: any,
  status: number,
  message: string,
  data: any = null,
  error: any = null,
) => {
  return c.json({ status, message, data, error }, 200);
};

// GET all
book.get('/', async (c) => {
  const books = await prisma.book.findMany({
    include: { category: true },
  });
  return apiResponse(c, 200, 'ok', books);
});

// GET by id
book.get('/:id', authMiddleware, async (c) => {
  const id = Number(c.req.param('id'));
  const book = await prisma.book.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!book) {
    return apiResponse(c, 404, 'Book not found');
  }

  return apiResponse(c, 200, 'ok', book);
});

// GET book image via API
book.get('/:id/image', authMiddleware, async (c) => {
  const id = Number(c.req.param('id'));

  const book = await prisma.book.findUnique({ where: { id } });

  if (!book || !book.imageUrl) {
    return c.notFound();
  }

  const filePath = `.${book.imageUrl}`;
  const file = Bun.file(filePath);

  if (!(await file.exists())) {
    return c.notFound();
  }

  return new Response(file, {
    headers: {
      'Content-Type': file.type,
    },
  });
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

  return apiResponse(c, 201, 'Created', book);
});

book.post('/many-books', authMiddleware, adminOnly, async (c) => {
  try {
    const body = await c.req.json(); // คาดหวังว่า body จะเป็น Array ของหนังสือ

    const books = await prisma.book.createMany({
      data: body, // ส่ง Array เข้าไปตรงๆ ได้เลย
      skipDuplicates: true,
    });

    return apiResponse(c, 201, 'Created Many Books Successfully', books);
  } catch (err) {
    return apiResponse(c, 500, 'Create many books failed', null, err);
  }
});

// POST upload book image (admin only)
book.post('/:id/image', authMiddleware, adminOnly, async (c) => {
  const id = Number(c.req.param('id'));

  if (isNaN(id)) {
    return apiResponse(c, 400, 'Invalid book id');
  }

  const body = await c.req.parseBody();
  const file = body.image as File;

  if (!file) {
    return apiResponse(c, 400, 'Image file is required');
  }

  if (!file.type.startsWith('image/')) {
    return apiResponse(c, 400, 'Only image files allowed');
  }

  // จำกัดขนาด (2MB)
  if (file.size > 2 * 1024 * 1024) {
    return apiResponse(c, 400, 'Image must be less than 2MB');
  }

  const ext = file.name.split('.').pop();
  const fileName = `${randomUUID()}.${ext}`;
  const filePath = `uploads/books/${fileName}`;

  // Bun native เขียนไฟล์
  await Bun.write(filePath, file);

  const imageUrl = `/uploads/books/${fileName}`;

  const book = await prisma.book.update({
    where: { id },
    data: { imageUrl },
  });

  return apiResponse(c, 200, 'Upload image success', book);
});

// PUT update
book.put('/:id', authMiddleware, adminOnly, async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();

  const book = await prisma.book.update({
    where: { id },
    data: body,
  });

  return apiResponse(c, 200, 'Updated', book);
});

// PUT update book image (admin only)
book.put('/:id/image', authMiddleware, adminOnly, async (c) => {
  const id = Number(c.req.param('id'));

  const body = await c.req.parseBody();
  const file = body.image as File;

  if (!file) {
    return apiResponse(c, 400, 'Image file is required');
  }

  if (!file.type.startsWith('image/')) {
    return apiResponse(c, 400, 'Only image files allowed');
  }

  // หา book เดิม
  const oldBook = await prisma.book.findUnique({ where: { id } });
  if (!oldBook) {
    return apiResponse(c, 404, 'Book not found');
  }

  // ลบรูปเก่า (ถ้ามี)
  if (oldBook.imageUrl) {
    const oldPath = `.${oldBook.imageUrl}`;
    try {
      await Bun.file(oldPath).delete();
    } catch {}
  }

  const ext = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = `uploads/books/${fileName}`;

  await Bun.write(filePath, file);

  const imageUrl = `/uploads/books/${fileName}`;

  const book = await prisma.book.update({
    where: { id },
    data: { imageUrl },
  });

  return apiResponse(c, 200, 'Image updated', book);
});

// DELETE
book.delete('/:id', authMiddleware, adminOnly, async (c) => {
  const id = Number(c.req.param('id'));
  await prisma.book.delete({ where: { id } });

  return apiResponse(c, 200, 'Deleted');
});

// DELETE book image (admin only)
book.delete('/:id/image', authMiddleware, adminOnly, async (c) => {
  const id = Number(c.req.param('id'));

  const book = await prisma.book.findUnique({ where: { id } });

  if (!book || !book.imageUrl) {
    return apiResponse(c, 404, 'Image not found');
  }

  const filePath = `.${book.imageUrl}`;

  try {
    await Bun.file(filePath).delete();
  } catch {
    return apiResponse(c, 500, 'Failed to delete image file');
  }

  const updatedBook = await prisma.book.update({
    where: { id },
    data: { imageUrl: null },
  });

  return apiResponse(c, 200, 'Image deleted', updatedBook);
});
