import express from 'express'
import authMiddleware from '../../middlewares/authmiddleware.js'
import prisma from '../../db/db.js'
const router = express.Router()
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        mobilenumber: true,
        name: true,
        college: true,
        year: true,
        department: true,
        createdAt: true,
      },
    })
    return res.status(200).json({ success: true, data: user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Something went wrong' })
  }
})

export default router