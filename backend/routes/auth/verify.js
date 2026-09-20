import express from "express";
import prisma from "../../db/db.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import axios from 'axios'
const router = express.Router()
router.use(express.json())
router.post("/verify-otp", async (req, res) => {
    try {
        const { sessionid, otp, username, password, mobilenumber, name, college, year, department } = req.body
        console.log(req.body)
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
            `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionid}/${otp}`
        );
        if(response.data.Status=="Success" && response.data.Details=="OTP Matched"){
        const hashedPassword = await bcryptjs.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                username,
                mobilenumber,
                password: hashedPassword,
                name,
                college,
                year,
                department
            }
        })
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.status(200).json({message:"User created successfully",token , user , branch : user.department , year: user.year});
    }
        else{
        return res.status(400).json({ message: "Invalid OTP code. Please try again." })
    }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
})















export default router