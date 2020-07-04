const app = require('http').createServer(handler)
const { parse } = require('url')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const opts = { dev };
const nextApp = next(opts)
const handle = nextApp.getRequestHandler()

const port = 3000

// Socket.io
const io = require('socket.io')(app)
io.on('connect', socket => {})
io.on('connection', socket => {
  let roomId

  socket.on('join', data => {
    roomId = data.roomId
    if (roomId) {
      socket.join(roomId)
      const room = io.sockets.adapter.rooms[roomId];
      socket.emit('join', room)
      socket.broadcast.to(roomId).emit('bc_join', room)
    }
  })

  socket.on('update_code', data => {
    if (roomId) {
      const { code } = data
      socket.emit('update_code', { code })
      socket.broadcast.to(roomId).emit('update_code', { code })
    }
  })

  socket.on('disconnect', function() {
    if (roomId) {
      const room = io.sockets.adapter.rooms[roomId];
      socket.emit('join', room)
      socket.broadcast.to(roomId).emit('bc_join', room)
    }
  })
})

function handler (req, res) {
  const parsedUrl = parse(req.url, true)
  handle(req, res, parsedUrl)
}

nextApp.prepare().then(() => {
  app.listen(port, (err) => {
    if (err) throw err
    console.log(`> is dev: ${dev}`)
    console.log(`> Ready on http://localhost:${port}`)
  })
})
