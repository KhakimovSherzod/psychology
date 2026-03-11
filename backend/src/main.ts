// src/main.ts - Updated with file upload middleware
import { PrismaClient } from '@prisma/client'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Request, type Response } from 'express'
import { createAuthContainer } from './modules/auth/container/createAuthContainer'
import { publicAuthRoutes } from './modules/auth/infrastructure/http/routes/auth.routes'
import { protectedPinRoutes } from './modules/auth/infrastructure/http/routes/pin.routes'
import { CategoryRoutes } from './modules/course/infrastructure/http/routes/category.route'
import { UserPlaylistRoutes } from './modules/course/infrastructure/http/routes/user.playlist.route'
import { userVideoRoutes } from './modules/course/infrastructure/http/routes/user.video.routes'
import { protectedUserRoutes } from './modules/user/infrastructure/http/routes/user.route'
import { errorMiddleware } from './shared/middlewares/error.middleware'
import { requestLogger } from './shared/middlewares/log.middleware'
import { AdminPlaylistRoutes } from './modules/course/infrastructure/http/routes/admin.playlist.route'
import { adminVideoRoutes } from './modules/course/infrastructure/http/routes/admin.video.routes'
import { EnrollmentRouter } from './modules/enrollment/infrastructure/http/router/enrollment.router'
import { orderRouter } from './modules/order/infrastructure/http/routes/order.route'
import {cartRouter} from './modules/cart/infrastructure/http/router/cart.router'
const app = express()
const port = process.env.PORT

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

app.use(cors(corsOptions))

// Increase payload size for file uploads
app.use(express.json({ limit: '500mb' }))
app.use(express.urlencoded({ limit: '500mb', extended: true }))
app.use(cookieParser())

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' })
})
app.use(requestLogger)
app.use('/public/', publicAuthRoutes)

//   ----------------------- MIDDLEWARE PROTECTED ROUTES -----------------------

const { authMiddleware } = createAuthContainer()
app.use(authMiddleware.handle)
app.use('/api/playlist/admin', AdminPlaylistRoutes)
app.use('/api/playlist/user', UserPlaylistRoutes)
app.use('/api/category', CategoryRoutes)
app.use('/api/users', protectedUserRoutes)
app.use('/api/videos/admin', adminVideoRoutes)
app.use('/api/videos/user', userVideoRoutes)
app.use('/api/auth/pin', protectedPinRoutes)
app.use('/api/enrollment', EnrollmentRouter)
app.use('/api/order', orderRouter)
app.use('/api/cart', cartRouter)
app.use(errorMiddleware)

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
  console.log(`Health check: http://localhost:${port}/health`)
})

// Prisma client
const prisma = new PrismaClient()

// Graceful shutdown
const shutdown = async () => {
  console.log('Closing server...')
  server.close(async () => {
    await prisma.$disconnect()
    console.log('Server closed.')
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
