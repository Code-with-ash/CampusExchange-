import 'dotenv/config'
import './config/env.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env.js'
import prisma from './db/db.js'
import authRouter from './routes/auth/index.js'
import userRouter from './routes/users/index.js'
import listProductRouter from './routes/listproduct/index.js'
import listingsRouter from './routes/listings/index.js'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js'
const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({
    origin(origin, callback) {
        if (!origin || env.frontendOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error('Origin not allowed'))
    },
    maxAge: 86400,
}))
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`
        return res.json({ status: 'ok', message: 'Server is running', database: 'connected' })
    } catch (error) {
        console.error('Health check failed:', error?.message || 'Unknown error')
        return res.status(503).json({ status: 'error', message: 'Service unavailable', database: 'disconnected' })
    }
})
app.use("/api/auth", authRouter)
app.use("/api/user" , userRouter)
app.use("/api/listproduct" , listProductRouter)
app.use("/api/listings" , listingsRouter)
app.use(notFoundHandler)
app.use(errorHandler)

export default app

if (process.env.VERCEL !== '1') {
    const server = app.listen(env.port, () => {
        console.log(`Server is running on port ${env.port}`)
    })

    function shutdown(signal) {
        console.log(`${signal} received, shutting down`)
        server.close(() => {
            process.exit(0)
        })
    }

    process.once('SIGTERM', () => shutdown('SIGTERM'))
    process.once('SIGINT', () => shutdown('SIGINT'))
}