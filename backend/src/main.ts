// src/main.ts
import { PrismaClient } from '@prisma/client'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import { authMiddleware } from './infrastructure/http/middlewares/auth.middleware'
import { publicAuthRoutes } from './infrastructure/http/routes/public.routes'
import { protectedRoutes } from './infrastructure/http/routes/user.route'

const app = express()
const port = process.env.PORT || 3001

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

// Apply CORS to all routes - this handles preflight automatically
app.use(cors(corsOptions))

// Parse JSON requests
app.use(express.json())
app.use(cookieParser())

app.use('/public/', publicAuthRoutes)

app.use(authMiddleware)

app.use('/api/users', protectedRoutes)

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message })
})

// 404 handler - use a function instead of '*'
app.use((req: Request, res: Response) => {
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
