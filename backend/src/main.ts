// src/main.ts
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import { userRoutes } from './infrastructure/http/routes'
import cookieParser from 'cookie-parser'

const app = express()
const port = process.env.PORT || 3001

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

// Apply CORS to all routes - this handles preflight automatically
app.use(cors(corsOptions))

// Parse JSON requests
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/users', userRoutes)

// Health check endpoint
app.get('/health', (res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Global error handler
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