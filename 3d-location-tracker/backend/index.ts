import express from 'express'
import next from 'next'
import { createServer } from 'http'
import { Server } from 'socket.io'
import authRoutes from './api/auth/[...nextauth]'
import locationRoutes from './api/location'
import userRoutes from './api/user/update'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: './frontend' })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  const httpServer = createServer(server)
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  // API routes
  server.use('/api/auth', authRoutes)
  server.use('/api/location', locationRoutes)
  server.use('/api/user', userRoutes)

  // Socket.IO
  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('updateLocation', (data) => {
      socket.broadcast.emit('locationUpdate', data)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })

  // Next.js request handler
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  httpServer.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})

