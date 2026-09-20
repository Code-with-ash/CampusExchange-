import express from "express"
import loginRouter from "./login.js"
import signupRouter from "./signup.js"
import verifyRouter from "./verify.js"
const router = express.Router()
router.use("/", loginRouter)
router.use("/", signupRouter)
router.use("/" , verifyRouter)
export default router