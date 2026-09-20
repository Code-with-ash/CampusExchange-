import express from "express";
import prisma from "../../db/db.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import axios from 'axios'
const router = express.Router()
router.post("/signup", async (req, res) => {
    try {
        const { username, password,mobilenumber ,  name, college, year, department } = req.body
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
            `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/+91${mobilenumber}/AUTOGEN`
        );
        res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})















export default router