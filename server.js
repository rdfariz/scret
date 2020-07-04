const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const opts = {
  dev
};
const nextApp = next(opts)
const nextHandler = nextApp.getRequestHandler()

let port = 3000

console.log(`> is dev: ${dev}`)

io.on('connect', socket => {
})
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

    // socket.emit('bc_log', `Welcome bro ${user}!`)
    // socket.broadcast.to(roomId).emit('bc_log', `${user} has joined!`)
    // console.log(io.sockets.adapter.rooms[roomId])

    // socket.emit('update_code', { code })
    // socket.broadcast.emit('update_code', { code })
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


nextApp.prepare().then(() => {
  app.get('*', (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
