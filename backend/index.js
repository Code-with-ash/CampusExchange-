import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import prisma from './db/db.js'
import authRouter from './routes/auth/index.js'
import userRouter from './routes/users/index.js'
import listProductRouter from './routes/listproduct/index.js'
import listingsRouter from './routes/listings/index.js'
const app = express()
app.use(express.json())
app.use(cors())

app.get("/api/health", (req, res) => {
    res.json({ message: "Server is running" })
})
app.use("/api/auth", authRouter)
app.use("/api/user" , userRouter)
app.use("/api/listproduct" , listProductRouter)
app.use("/api/listings" , listingsRouter)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})