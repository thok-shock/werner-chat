const express = require('express')
const acmeRouter = require('./acme')
const WiscITRouter = require('./wiscit')

const APIRouter = express.Router()

APIRouter.use('/wiscit', WiscITRouter)
APIRouter.use('/acme', acmeRouter)

module.exports = APIRouter