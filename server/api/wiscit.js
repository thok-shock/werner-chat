const express = require('express')
const { default: fetch } = require('node-fetch')

function login() {
    return new Promise((resolve, reject) => {
        fetch('https://test.wiscit.wisc.edu/CherwellAPI/token?api_key=ccb138e8-a7d4-4c71-90e8-f167191cb004', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
        body: "grant_type=password&client_id=ccb138e8-a7d4-4c71-90e8-f167191cb004&username=hd_swis_api&password=qpYrwISQuURT"
    }).then(login => {
        return login.json()
    }).then(login => {
        console.log(login)
        resolve(login)
    }).catch(err => {
        reject(err)
    })
    })
}

const WiscITRouter = express.Router()

WiscITRouter.get('/fields', (req, res) => {
    login()
    .then(token => {
        
    })
})

module.exports = WiscITRouter