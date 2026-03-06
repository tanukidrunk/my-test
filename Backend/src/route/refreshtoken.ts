import { randomUUID } from 'crypto'
import { Hono } from 'hono'
import { prisma } from '../prisma'

export const refreshToken = new Hono()

refreshToken.post('/', async (c) => {
  const body = await c.req.json()

  const token = randomUUID()

  const data = await prisma.refreshToken.create({
    data: {
      token,
      memberId: body.memberId,
      expiresAt: new Date(body.expiresAt)
    }
  })
 
  return c.json(data)
})

refreshToken.delete('/', async (c) => {
  const body = await c.req.json()

  await prisma.refreshToken.deleteMany({
    where: {
      token: body.token
    }
  })

  return c.json({ message: 'Token revoked' })
})