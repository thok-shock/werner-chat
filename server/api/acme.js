const express = require('express')
const { acmeDB, swis2DB } = require('../sql')

function getShifts(startDate, endDate) {
    return new Promise((resolve, reject) => {
        swis2DB.query({
            sql: 'SELECT agent, date, shift, COUNT(shift) duration FROM swis2.aggregate_data_view WHERE date >= ? AND date <= ? GROUP BY agent, date, shift;',
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
            sql: 'SELECT SS_Employee.*, GROUP_CONCAT(DISTINCT CONCAT(team_name) SEPARATOR ", ") AS team_name, GROUP_CONCAT(DISTINCT CONCAT(display) SEPARATOR ", ") AS training_levels FROM SS_Employee LEFT JOIN (SS_Employee_Group_Attributes, SS_Teams) ON (SS_Employee.Employee_ID = SS_Employee_Group_Attributes.Employee_ID AND SS_Employee_Group_Attributes.Value = SS_Teams.Team_ID) LEFT JOIN SS_Training ON SS_Training.Employee_ID = SS_Employee.Employee_ID LEFT JOIN SS_Training_Types ON SS_Training.Training_ID = SS_Training_Types.id WHERE SS_Employee_Group_Attributes.Key = "Team" GROUP BY SS_Employee.Employee_ID , First_Name , Nick_Name , Last_Name , Login , NetID , Cell_Phone , `Status` , Team , Employment_Active , SS_Employee.Created , Graduation_Date , Modified , Hire_Date , Email_address , Inactive_date , Military , scheduleExportLink;'
        }, function(err, rows) {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

function getAcmeTeams() {
    return new Promise((resolve, reject) => {
        acmeDB.query({
            sql: 'SELECT * FROM acme_wisc_edu_hd.SS_Teams;'
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

acmeRouter.get('/teamNames', (req, res) => {
    getAcmeTeams()
    .then(data => {
        res.json(data)
    })
})

module.exports = acmeRouter