require("dotenv").config()
const express = require('express')
const webpack = require('webpack')
const config = require("../webpack.config.js")
const middleware = require('webpack-dev-middleware')
const compiler = webpack(config)
const path = require('path')
const APIRouter = require("./api/api.js")
const rootPath = path.resolve(__dirname, '..');

const app = express()

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

app.get('/hdqa', (req, res) => {
    res.sendFile(rootPath + '/src/index.html')
})

app.get('/data', (req, res) => {
    res.sendFile(rootPath + '/src/index.html')
})

app.get('/public/:path', (req, res) => {
    res.sendFile(rootPath + '/public/' + req.params.path)
})

app.use('/api', APIRouter)

app.listen(3000, () => {
    console.log('Running on port 3000')
})