import express from "express";
import prisma from "../../db/db.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
const router = express.Router()

router.post("/login", async (req, res) => {
    try {
        console.log("here i am")
        const { username, password } = req.body
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const { password: _, ...safeUser } = user
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return res.status(200).json({
            message: "User logged in successfully",
            token,
            user: safeUser,
            branch: user.department,
            year: user.year
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
})















export default router