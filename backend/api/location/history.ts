import express from 'express'
import prisma from '../../lib/prisma'

const router = express.Router()

router.get('/', async (req, res) => {
  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' })
  }

  try {
    const locations = await prisma.location.findMany({
      where: {
        userId: userId as string,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })
    res.json(locations)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching location history' })
  }
})

export default router

