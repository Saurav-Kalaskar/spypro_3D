import express from 'express'
import prisma from '../../lib/prisma'

const router = express.Router()

router.post('/', async (req, res) => {
  const { id, name, email } = req.body

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    })
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: 'Error updating user profile' })
  }
})

export default router

