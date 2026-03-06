import { Hono } from 'hono'
import { prisma } from '../prisma'

export const reservation = new Hono()

reservation.get('/', async (c) => {
  const data = await prisma.reservation.findMany({
    include: {
      member: true,
      book: true
    }
  })

  return c.json(data)
})

reservation.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const data = await prisma.reservation.findUnique({
    where: { id },
    include: {
      member: true,
      book: true
    }
  })

  return c.json(data)
})

reservation.post('/', async (c) => {
  const body = await c.req.json()

  const reservation = await prisma.reservation.create({
    data: {
      memberId: body.memberId,
      bookId: body.bookId,
      expiresAt: new Date(body.expiresAt)
    }
  })

  return c.json(reservation)
})

reservation.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json()

  const data = await prisma.reservation.update({
    where: { id },
    data: {
      status: body.status
    }
  })

  return c.json(data)
})

reservation.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))

  await prisma.reservation.delete({
    where: { id }
  })

  return c.json({ message: 'Reservation deleted' })
})