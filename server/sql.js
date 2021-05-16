const mysql = require('mysql')

const acmeDB = mysql.createPool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    database: process.env.DB
})

const swis2DB = mysql.createPool({
    user: process.env.USER2,
    password: process.env.PASSWORD2,
    host: process.env.HOST2,
    database: process.env.DB2
})

module.exports = {acmeDB, swis2DB}