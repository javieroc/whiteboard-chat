'use strict'

const http = require('http')
const path = require('path')
const express = require('express')

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'client', 'build')))

function onConnection (socket) {
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data))
}

io.on('connection', onConnection)

server.listen(3000, () => {
  console.log('server listening on port 3000')
})
