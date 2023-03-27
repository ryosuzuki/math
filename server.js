import fs from 'fs'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { PythonShell } from 'python-shell'
import cors from 'cors'
const filename = fileURLToPath(import.meta.url)
const directory = dirname(filename)

const app = express()
const httpServer = createServer(app)
app.use(cors())

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

app.use(express.static(directory))

app.get('/', (req, res) => {
  res.sendFile(join(directory, '/public/index.html'))
})

httpServer.listen(4000, () => {
  console.log('listening 4000')
})

const pyshell = new PythonShell('test.py');

io.on('connection', (socket) => {
  console.log('connected to: ' + socket.id)
  socket.emit('socketid', socket.id)

  socket.on('sympy', (data) => {
    console.log('hoge')
    data = JSON.stringify(data)
    pyshell.send(data)
  })

  pyshell.on('message', (result) => {
    socket.emit('sympy', result)
  })
})

function getJson(path) {
  return JSON.parse(fs.readFileSync(join(directory, path), 'utf8'))
}

function saveJson(path, json) {
  fs.writeFileSync(join(directory, path), JSON.stringify(json, 'null', 2))
}