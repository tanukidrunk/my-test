import { Hono } from 'hono';
import { prisma } from '../prisma';
import { authMiddleware } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { Gender } from '../../generated/prisma/client';
import argon2 from "argon2";
// import bcrypt from "bcrypt";
import { adminOnly } from '../middleware/adminOnly';

const JWT_SECRET = process.env.JWT_SECRET!;
const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;
const apiResponse = (
  c: any,
  status: number,
  message: string,
  data: any = null,
  error: any = null
) => {
  return c.json({ status, message, data, error }, 200);
};

export const mem = new Hono();



mem.get('/', authMiddleware,adminOnly, async (c) => {
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

mem.get("/profile", authMiddleware, async (c) => {
  const payload = c.get("member"); 

  const user = await prisma.member.findUnique({
    where: { id: payload.memberId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  return c.json({
    status: 200,
    message: "ok",
    data: user,
  });
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
      return apiResponse(c, 401, "Invalid email or password");
    }

    const token = jwt.sign(
      { memberId: member.id, email: member.email , role: member.role, },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    return apiResponse(c, 200, 'login success', { token });
  } catch (err) {
    return apiResponse(c, 500, 'Login failed', null, err);
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
      'Password must be at least 10 characters and contain uppercase, lowercase, and number'
    );
  }

  if (gender && !Object.values(Gender).includes(gender)) {
    return apiResponse(c, 400, 'Invalid gender');
  }
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });;
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

mem.put('/profile', authMiddleware, async (c) => {
  const member = c.get("member") as { memberId: number };
  const body = await c.req.json();
  const { username, gender, password } = body;

  if (gender && !Object.values(Gender).includes(gender)) {
    return apiResponse(c, 400, 'Invalid gender');
  }

  try {
    const data: any = {
      username,
      gender,
    };

    if (password) {
      data.password = await argon2.hash(password, {type: argon2.argon2id });;
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

    return apiResponse(c, 200, 'Profile updated (PUT)', updated);
  } catch (err) {
    return apiResponse(c, 500, 'Update profile failed', null, err);
  }
});

mem.patch('/editprofile', authMiddleware, async (c) => {
  const member = c.get("member") as { memberId: number };
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
      data.password = await argon2.hash(password, {type: argon2.argon2id});;
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

