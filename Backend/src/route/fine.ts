import { Hono } from 'hono';
import { prisma } from '../prisma';
import { authMiddleware } from '../middleware/auth';
export const fine = new Hono();

fine.get('/', authMiddleware, async (c) => {
  const data = await prisma.fine.findMany({
    include: {
      member: true,
      borrow: true,
    },
  });

  return c.json(data);
});

fine.get('/:id', authMiddleware, async (c) => {
  const id = Number(c.req.param('id'));

  const data = await prisma.fine.findUnique({
    where: { id },
    include: {
      member: true,
      borrow: true,
    },
  });

  return c.json(data);
});

fine.post('/', authMiddleware, async (c) => {
  const body = await c.req.json();

  const fine = await prisma.fine.create({
    data: {
      memberId: body.memberId,
      borrowId: body.borrowId,
      amount: body.amount,
    },
  });

  return c.json(fine);
});

fine.patch('/:id/pay', authMiddleware, async (c) => {
  const id = Number(c.req.param('id'));

  const data = await prisma.fine.update({
    where: { id },
    data: {
      paid: true,
    },
  });

  return c.json(data);
});
