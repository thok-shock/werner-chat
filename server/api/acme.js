const express = require('express')
const { acmeDB, swis2DB } = require('../sql')

function getShifts(startDate, endDate) {
    return new Promise((resolve, reject) => {
        swis2DB.query({
            sql: 'SELECT agent, date, shift, COUNT(shift) duration FROM swis2.aggregate_data_view WHERE date > ? AND date < ? GROUP BY agent, date, shift;',
            values: [startDate, endDate]
        }, function(err, rows) {
            if (err) reject(err)
            resolve(rows)
        })
    })  
}

function getAcmeShiftNames() {
    return new Promise((resolve, reject) => {
        acmeDB.query({
            sql: 'SELECT * FROM acme_wisc_edu_hd.SS_Employee;'
        }, function(err, rows) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}


const acmeRouter = express.Router()

acmeRouter.get('/shifts', (req, res) => {
    getShifts(req.query.startDate, req.query.endDate)
    .then(data => {
        res.json(data)
    })
})

acmeRouter.get('/shiftNames', (req, res) => {
    getAcmeShiftNames()
    .then(data => {
        res.json(data)
    })
})

module.exports = acmeRouter