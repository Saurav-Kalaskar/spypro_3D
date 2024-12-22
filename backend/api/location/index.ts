import express from 'express'
import prisma from '../../lib/prisma'

const router = express.Router()

router.post('/', async (req, res) => {
  const { latitude, longitude, altitude, floor, userId } = req.body

  try {
    const location = await prisma.location.create({
      data: {
        latitude,
        longitude,
        altitude,
        floor,
        userId,
      },
    })
    res.json(location)
  } catch (error) {
    res.status(500).json({ error: 'Error saving location' })
  }
})

export default router

