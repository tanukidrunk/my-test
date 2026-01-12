import { Hono } from 'hono';
import { prisma } from '../prisma';
import { authMiddleware } from '../middleware/auth';
import {BorrowStatus} from "../../generated/prisma/client"; 
export const borr = new Hono();
const apiResponse = (
  c: any,
  status: number,
  message: string,
  data: any = null,
  error: any = null
) => {
  return c.json({ status, message, data, error }, 200);
};

borr.get('/', authMiddleware, async (c) => {
  const data = await prisma.borrowed.findMany({
    include: {
      member: true,
      book: true,
    },
  });
  return apiResponse(c, 200, "ok", data);
});

borr.get('/member', authMiddleware, async (c) => {
   const member = c.get("member");
    const data = await prisma.borrowed.findMany({
     where: { memberId: member.memberId },
    include: { book: true },
  });
  return apiResponse(c, 200, "ok", data);
});

// POST borrow book
borr.post('/borrowed', authMiddleware, async (c) => {
  const member = c.get("member");
    const body = await c.req.json();

    const book = await prisma.book.findUnique({
    where: { id: body.bookId },
  });

  if (!book || book.status !== "AVAILABLE") {
    return apiResponse(c, 400, "Book not available");
  }
  const borrow = await prisma.borrowed.create({
    data: {
      memberId: body.memberId,
      bookId: body.bookId,
      status: BorrowStatus.BORROWED,
    },
  });

  // อัปเดตสถานะหนังสือ
  await prisma.book.update({
    where: { id: body.bookId },
    data: { status: 'BORROWED' },
  });

  return c.json(borrow, 201);
});

// PUT return / update status
borr.put('/return/:id', authMiddleware, async (c) => {
  const id = Number(c.req.param('id'));

  const record = await prisma.borrowed.findUnique({
    where: { id },
  });

  if (!record) {
    return apiResponse(c, 404, "Borrow record not found");
  }

  if (record.status === "RETURNED") {
    return apiResponse(c, 400, "This book has already been returned");
  }

  const updated = await prisma.borrowed.update({
    where: { id },
    data: {
      status: BorrowStatus.RETURNED,
      returnDate: new Date(), // บันทึกวันคืน
    },
  });

  await prisma.book.update({
    where: { id: updated.bookId },
    data: { status: 'AVAILABLE' },
  });

  return apiResponse(c, 200, "Returned", updated);
});



