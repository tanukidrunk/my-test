import { Hono } from 'hono'
import { prisma } from '../prisma'

export const fine = new Hono()


fine.get('/', async (c) => {
  const data = await prisma.fine.findMany({
    include: {
      member: true,
      borrow: true
    }
  })

  return c.json(data)
})

fine.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const data = await prisma.fine.findUnique({
    where: { id },
    include: {
      member: true,
      borrow: true
    }
  })

  return c.json(data)
})

fine.post('/', async (c) => {
  const body = await c.req.json()

  const fine = await prisma.fine.create({
    data: {
      memberId: body.memberId,
      borrowId: body.borrowId,
      amount: body.amount
    }
  })

  return c.json(fine)
})

fine.patch('/:id/pay', async (c) => {
  const id = Number(c.req.param('id'))

  const data = await prisma.fine.update({
    where: { id },
    data: {
      paid: true
    }
  })

  return c.json(data)
})