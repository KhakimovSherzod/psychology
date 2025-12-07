// src/main.ts - Updated with file upload middleware
import { PrismaClient } from '@prisma/client'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import { protectedUserRoutes } from './modules/user/infrastructure/http/routes/user.route'
import { authMiddleware } from './shared/middlewares/auth.middleware'
import { protectedCoursesRoutes } from './modules/course/infrastructure/http/routes/course.route'
import { videoRoutes } from './modules/course/infrastructure/http/routes/video.routes'
import { publicAuthRoutes } from './modules/auth/infrastructure/http/routes/auth.routes'
import { protectedPinRoutes } from './modules/auth/infrastructure/http/routes/pin.routes'

const app = express()
const port = process.env.PORT || 3001

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

// Protected routes (with auth middleware)
app.use(authMiddleware)
app.use('/api/users', protectedUserRoutes)
app.use('/api/courses', protectedCoursesRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/auth/pin', protectedPinRoutes)

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message })
})

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Route not found' })
})

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
