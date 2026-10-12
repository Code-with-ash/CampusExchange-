import express from "express";
import prisma from "../../db/db.js";
import bcryptjs from 'bcryptjs'
import { signAccessToken } from '../../utils/jwt.js'
import { validateString } from '../../utils/validation.js'
const router = express.Router()

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body
        const usernameError = validateString(username, 'Username', { min: 3, max: 50 })
        const passwordError = validateString(password, 'Password', { min: 8, max: 128 })
        if (usernameError || passwordError) {
            return res.status(400).json({ message: usernameError || passwordError })
        }
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const { password: _, ...safeUser } = user
        const token = signAccessToken(user.id)
        return res.status(200).json({
            message: "User logged in successfully",
            token,
            user: safeUser,
            branch: user.department,
            year: user.year
        })

    } catch (error) {
        console.error('Login failed:', error?.message || 'Unknown error')
        return res.status(500).json({ message: "Internal server error" })
    }
})















export default router