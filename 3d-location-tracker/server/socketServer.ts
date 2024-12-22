import { Server } from 'socket.io'
import { createServer } from 'http'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res)
  })

  const io = new Server(server)

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('updateLocation', (data) => {
      socket.broadcast.emit('locationUpdate', data)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })

  server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
  })
})

