import { Hono } from 'hono';
import { prisma } from '../prisma';
import { authMiddleware } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';

export const cate = new Hono();

const apiResponse = (
  c: any,
  status: number,
  message: string,
  data: any = null,
  error: any = null,
) => {
  return c.json({ status, message, data, error }, 200);
};

// GET all categories
cate.get('/', authMiddleware, adminOnly, async (c) => {
  try {
    const categories = await prisma.category.findMany({
      include: { books: true },
    });
    return apiResponse(c, 200, 'ok', categories);
  } catch (err) {
    return apiResponse(c, 500, 'Failed to fetch categories', null, err);
  }
});

// POST create
cate.post('/', authMiddleware, adminOnly, async (c) => {
  try {
    const body = await c.req.json();
    const category = await prisma.category.create({
      data: { name: body.name },
    });
    return apiResponse(c, 201, 'Created', category);
  } catch (err) {
    return apiResponse(c, 500, 'Create category failed', null, err);
  }
});

cate.post('/add-categoies', authMiddleware, adminOnly, async (c) => {
  try {
    const body = await c.req.json();
    const category = await prisma.category.createMany({
      data: { name: body.name },
    });
    return apiResponse(c, 201, 'Created', category);
  } catch (err) {
    return apiResponse(c, 500, 'Create category failed', null, err);
  }
});

cate.post('/add-cate', authMiddleware, adminOnly, async (c) => {
  try {
    const body = await c.req.json(); // สมมติว่า body ส่งมาเป็น Array

    // ตรวจสอบว่าถ้า body ไม่ใช่ Array ให้ทำเป็น Array ก่อน
    const dataToInsert = Array.isArray(body) ? body : [body];

    const categories = await prisma.category.createMany({
      data: dataToInsert,
      skipDuplicates: true, // เลือกใส่เพิ่มเพื่อป้องกัน error กรณีชื่อซ้ำ
    });

    return apiResponse(c, 201, 'Created successfully', categories);
  } catch (err) {
    return apiResponse(c, 500, 'Create category failed', null, err);
  }
});

// PUT update
cate.put('/:id', authMiddleware, adminOnly, async (c) => {
  try {
    const id = Number(c.req.param('id'));
    const body = await c.req.json();

    const category = await prisma.category.update({
      where: { id },
      data: { name: body.name },
    });

    return apiResponse(c, 200, 'Updated', category);
  } catch (err) {
    return apiResponse(c, 500, 'Update category failed', null, err);
  }
});

// DELETE
cate.delete('/:id', authMiddleware, adminOnly, async (c) => {
  try {
    const id = Number(c.req.param('id'));
    await prisma.category.delete({ where: { id } });
    return apiResponse(c, 200, 'Deleted');
  } catch (err) {
    return apiResponse(c, 500, 'Delete category failed', null, err);
  }
});
