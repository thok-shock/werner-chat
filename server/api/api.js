const express = require('express')
const WiscITRouter = require('./wiscit')

const APIRouter = express.Router()

APIRouter.use('/wiscit', WiscITRouter)

module.exports = APIRouter