import { Hono } from 'hono';
import { prisma } from '../prisma';
import { authMiddleware } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { Gender } from '../../generated/prisma/client';
import argon2 from 'argon2';
// import bcrypt from "bcrypt";
import { adminOnly } from '../middleware/adminOnly';
import { setCookie, deleteCookie } from 'hono/cookie';

const JWT_SECRET = process.env.JWT_SECRET!;
const apiResponse = (
  c: any,
  status: number,
  message: string, 
  data: any = null,
  error: any = null,
) => {
  return c.json({ status, message, data, error }, 200);
};

export const mem = new Hono();

mem.get('/', authMiddleware, adminOnly, async (c) => {
  try {
    const members = await prisma.member.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
      },
    });
    return apiResponse(c, 200, 'Get members success', members);
  } catch (err) { 
    return apiResponse(c, 500, 'Internal Server Error', null, err);
  }
});

mem.get('/book', async (c) => {
  const books = await prisma.book.findMany({
    include: {
      category: true,
      Borrows: true, // สำคัญ
    }, 
  });

  return apiResponse(c, 200, 'success', books);
});

mem.get('/profile', authMiddleware, async (c) => {
  const payload = c.get('member');

  if (!payload) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    const user = await prisma.member.findUnique({
      where: { id: payload.memberId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        gender: true,
      },
    });

    if (!user) {
      return c.json({ message: 'User not found' }, 404);
    }

    return c.json({
      status: 200,
      message: 'ok',
      data: user,
    });
  } catch (err) {
    console.error(err);
    return c.json({ message: 'Server error' }, 500);
  }
}); 
 

mem.post('/login', async (c) => {
  const body = await c.req.json();
  const { email, password } = body;

  if (!email || !password) {
    return apiResponse(c, 400, 'Missing email or password');
  }

  try {
    const member = await prisma.member.findUnique({
      where: { email },
    });

    if (!member) {
      return apiResponse(c, 401, 'Invalid email or password');
    }

    const isMatch = await argon2.verify(member.password, password);
    if (!isMatch) {
      return apiResponse(c, 401, 'Invalid email or password');
    }

    // 🔐 Access Token
    const accessToken = jwt.sign(
      { memberId: member.id, role: member.role },
      JWT_SECRET,
      { expiresIn: '15m' },
    );

    // 🔄 Refresh Token
    const refreshToken = jwt.sign({ memberId: member.id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    
    // เก็บลง DB
    await prisma.refreshToken.create({
      data: {
        token: await argon2.hash(refreshToken), // hash ก่อนเก็บ
        memberId: member.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // ✅ Set HttpOnly Cookies
    setCookie(c, 'accessToken', accessToken, {
      httpOnly: true,
      secure: false, 
      sameSite: 'Lax', 
      maxAge: 60 * 60,
      path: '/',
    });

    setCookie(c, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return apiResponse(c, 200, 'Login successful', {
      user: {
        id: member.id,
        email: member.email,
        role: member.role,
      },
    });
  } catch (err) {
    console.error(err);
    return apiResponse(c, 500, 'Login failed');
  }
});

mem.post('/register', async (c) => {
  const body = await c.req.json();
  const { email, username, password, gender } = body;
  const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;
  if (!passwordRule.test(password)) {
    return apiResponse(
      c,
      400,
      'Password must be at least 10 characters and contain uppercase, lowercase, and number',
    );
  } 

  if (gender && !Object.values(Gender).includes(gender)) {
    return apiResponse(c, 400, 'Invalid gender');
  }
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });
    const member = await prisma.member.create({
      data: {
        email,
        username,
        password: hashedPassword, 
        gender,
      },
    });
    return apiResponse(c, 201, 'Registion succes', member);
  } catch (err) {
    return apiResponse(c, 500, 'Register failed', null, err);
  }
});
 
mem.post('/logout', (c) => {
  deleteCookie(c, 'accessToken', {
    path: '/',
  });
  return apiResponse(c, 200, 'Logout success');
});

mem.patch('/profile', authMiddleware, async (c) => {
  const member = c.get('member') as { memberId: number };
  const body = await c.req.json();
  const { username, gender, password } = body;

  if (gender && !Object.values(Gender).includes(gender)) {
    return apiResponse(c, 400, 'Invalid gender');
  }

  try {
    const data: any = {};

    if (username !== undefined) data.username = username;
    if (gender !== undefined) data.gender = gender;
    if (password !== undefined) {
      data.password = await argon2.hash(password, { type: argon2.argon2id });
    }

    const updated = await prisma.member.update({
      where: { id: member.memberId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
      },
    });

    return apiResponse(c, 200, 'Profile updated (PATCH)', updated);
  } catch (err) {
    return apiResponse(c, 500, 'Update profile failed', null, err);
  }
});
