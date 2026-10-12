import express from "express";
import prisma from "../../db/db.js";
import bcryptjs from 'bcryptjs'
import axios from 'axios'
import { signAccessToken } from '../../utils/jwt.js'
import { validateString, isValidPhoneNumber, parseFiniteNumber } from '../../utils/validation.js'
const router = express.Router()
router.use(express.json())
router.post("/verify-otp", async (req, res) => {
    try {
        const { sessionid, otp, username, password, mobilenumber, name, college, year, department } = req.body
        const stringFields = [
            ['username', username, 3, 50],
            ['password', password, 8, 128],
            ['name', name, 2, 100],
            ['college', college, 2, 150],
            ['department', department, 2, 100],
            ['sessionid', sessionid, 1, 200],
            ['otp', otp, 6, 6],
        ]
        const invalidField = stringFields
            .map(([field, value, min, max]) => validateString(value, field, { min, max }))
            .find(Boolean)
        const currentYear = new Date().getFullYear()
        const parsedYear = parseFiniteNumber(year, 'year', { min: currentYear - 5, max: currentYear + 5 })
        if (invalidField || !isValidPhoneNumber(mobilenumber) || !/^\d{6}$/.test(otp) || parsedYear.error) {
            return res.status(400).json({ message: invalidField || 'Invalid verification details' })
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { mobilenumber: mobilenumber }
                ]
            }
        })
        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Username already exists" })
            }
            if (existingUser.mobilenumber === mobilenumber) {
                return res.status(400).json({ message: "Mobile number already registered" })
            }
        }
        const response = await axios.get(
            `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionid}/${otp}`,
            { timeout: 10000 }
        )
        if(response.data.Status=="Success" && response.data.Details=="OTP Matched"){
        const hashedPassword = await bcryptjs.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                username,
                mobilenumber,
                password: hashedPassword,
                name,
                college,
                year: parsedYear.value,
                department
            }
        })
        const { password: _password, ...safeUser } = user
        const token = signAccessToken(user.id)
        res.status(200).json({message:"User created successfully",token , user: safeUser , branch : user.department , year: user.year});
    }
        else{
        return res.status(400).json({ message: "Invalid OTP code. Please try again." })
    }
    } catch (error) {
        console.error('OTP verification failed:', error?.message || 'Unknown error')
        return res.status(500).json({ message: "Internal server error" })
    }
})















export default router