import express from "express";
import prisma from "../../db/db.js";
import bcryptjs from 'bcryptjs'
import axios from 'axios'
import { validateString, isValidPhoneNumber, parseFiniteNumber } from '../../utils/validation.js'
const router = express.Router()
router.post("/signup", async (req, res) => {
    try {
        const { username, password,mobilenumber ,  name, college, year, department } = req.body
        const stringFields = [
            ['username', username, 3, 50],
            ['password', password, 8, 128],
            ['name', name, 2, 100],
            ['college', college, 2, 150],
            ['department', department, 2, 100],
        ]
        const invalidField = stringFields
            .map(([field, value, min, max]) => validateString(value, field, { min, max }))
            .find(Boolean)
        const currentYear = new Date().getFullYear()
        const parsedYear = parseFiniteNumber(year, 'year', { min: currentYear - 5, max: currentYear + 5 })
        if (invalidField || !isValidPhoneNumber(mobilenumber) || parsedYear.error) {
            return res.status(400).json({ message: invalidField || 'Invalid signup details' })
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { mobilenumber }
                ]
            }
        })
        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: "User already exists" })
            }
            if (existingUser.mobilenumber === mobilenumber) {
                return res.status(400).json({ message: "Mobile number already registered" })
            }
        }
        const response = await axios.get(
            `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/+91${mobilenumber}/AUTOGEN`,
            { timeout: 10000 }
        )
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Signup failed:', error?.message || 'Unknown error')
        return res.status(500).json({ message: "Internal server error" })
    }
})















export default router