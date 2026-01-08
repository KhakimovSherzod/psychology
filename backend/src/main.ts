// src/main.ts - Updated with file upload middleware
import { PrismaClient } from '@prisma/client'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Request, type Response } from 'express'
import { publicAuthRoutes } from './modules/auth/infrastructure/http/routes/auth.routes'
import { protectedPinRoutes } from './modules/auth/infrastructure/http/routes/pin.routes'
import { CategoryRoutes } from './modules/course/infrastructure/http/routes/category.route'
import { PlaylistRoutes } from './modules/course/infrastructure/http/routes/playlist.route'
import { videoRoutes } from './modules/course/infrastructure/http/routes/video.routes'
import { protectedUserRoutes } from './modules/user/infrastructure/http/routes/user.route'
import { authMiddleware } from './shared/middlewares/auth.middleware'

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

app.use('/public/', publicAuthRoutes)


//   ----------------------- MIDDLEWARE PROTECTED ROUTES -----------------------
app.use(authMiddleware)
app.use('/api/playlist', PlaylistRoutes)
app.use('/api/category', CategoryRoutes)
app.use('/api/users', protectedUserRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/auth/pin', protectedPinRoutes)

// app.use(errorMiddleware)

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
