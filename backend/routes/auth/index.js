import express from "express"
import loginRouter from "./login.js"
import signupRouter from "./signup.js"
import verifyRouter from "./verify.js"
import { authRateLimit, otpRateLimit } from "../../middlewares/rateLimit.js"
const router = express.Router()
router.use("/", authRateLimit, loginRouter)
router.use("/", authRateLimit, signupRouter)
router.use("/", otpRateLimit, verifyRouter)
export default router