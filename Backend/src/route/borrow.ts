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
    orderBy: { loanDate: "desc" },
  });

  return apiResponse(c, 200, "ok", data);
});

// POST borrow book


borr.post('/borrowed', authMiddleware, async (c) => {
  try {
    const user = c.get('member');
    const { bookId } = await c.req.json();

    if (!bookId) {
      return apiResponse(c, 400, 'Missing bookId');
    }

    // ??? transaction ????????????
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.borrowed.findFirst({
        where: {
          memberId: user.memberId,
          bookId,
          status: 'BORROWED',
        },
      });
      
      if (existing) {
        throw new Error('You already borrowed this book');
      }
      const book = await tx.book.findUnique({
        where: { id: bookId },
      });

      if (!book) {
        throw new Error('Book not found');
      }

      if (book.status === 'BORROWED') {
        throw new Error('Book already borrowed');
      }

      // ????? Borrowed record
      await tx.borrowed.create({
        data: {
          memberId: user.memberId,
          bookId,
          status: 'BORROWED',
        },
      });

      // Update book status
      await tx.book.update({
        where: { id: bookId },
        data: { status: 'BORROWED' },
      });

      // ??????????????????????????
      return tx.book.findMany({
        include: {
          category: true,
          Borrows: true,
        },
      });
    });

    return apiResponse(c, 200, 'Borrow success', result);

  } catch (err: any) {
    return apiResponse(c, 400, err.message);
  }
});

// PUT return / update status
borr.put('/return/:id', authMiddleware, async (c) => {
  try {
    const member = c.get("member");
    const borrowId = Number(c.req.param("id"));

    const result = await prisma.$transaction(async (tx) => {

      const borrow = await tx.borrowed.findUnique({
        where: { id: borrowId },
      });

      if (!borrow) {
        throw new Error("Borrow record not found");
      }

      if (borrow.memberId !== member.memberId) {
        throw new Error("Unauthorized");
      }

      if (borrow.status === "RETURNED") {
        throw new Error("Already returned");
      }

      // 1?? update borrow
      await tx.borrowed.update({
        where: { id: borrowId },
        data: {
          status: "RETURNED",
          returnDate: new Date(),
        },
      });

      // 2?? update book
      await tx.book.update({
        where: { id: borrow.bookId },
        data: { status: "AVAILABLE" },
      });

      // 3?? return updated list
      return tx.borrowed.findMany({
        where: { memberId: member.memberId },
        include: { book: true },
        orderBy: { loanDate: "desc" },
      });
    });

    return apiResponse(c, 200, "Returned successfully", result);

  } catch (err: any) {
    return apiResponse(c, 400, err.message);
  }
});


