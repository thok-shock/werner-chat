require("dotenv").config()
const express = require('express')
const webpack = require('webpack')
const config = require("../webpack.config.js")
const middleware = require('webpack-dev-middleware')
const compiler = webpack(config)
const path = require('path')
const rootPath = path.resolve(__dirname, '..');
const http = require('http')


const app = express()
const server = http.createServer(app);
const {Server} = require('socket.io')
const io = new Server(server)

app.use(express.urlencoded({extended: true}))
app.use(express.json({}))

if (process.env.ENVIRONMENT === 'dev') {
    console.log('Compiling in Development Environment')
    app.use(middleware(compiler, {
        publicPath: '/'
    }))
    app.use(require("webpack-hot-middleware")(compiler))
} else {
    console.log('Running in Production Mode')
}

app.get('/', (req, res) => {
    res.sendFile(rootPath + '/src/index.html')
})

app.get("/main.bundle.js", (req, res) => {
    console.log('returning bundle')
    res.sendFile(rootPath + "/src/main.bundle.js");
  });

io.on('connection', (socket) => {
    console.log('A user has connected')

    socket.on('msg', (message, time) => {
        console.log(message + ' ' + time)
        socket.broadcast.emit('new message', {message, time})
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')

    
    })
})


server.listen(3000, () => {
    console.log('Running on port 3000')
})