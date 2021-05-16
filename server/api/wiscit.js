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

function getIncidentFields(token) {
    return new Promise((resolve, reject) => {
        fetch('https://test.wiscit.wisc.edu/CherwellAPI/api/V1/getbusinessobjecttemplate?api_key=ccb138e8-a7d4-4c71-90e8-f167191cb004', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": "Bearer " + token},
        body: JSON.stringify({busObId: "6dd53665c0c24cab86870a21cf6434ae", includeAll: true})
    }).then(fields => {
        return fields.json()
    }).then(fields => {
        console.log(fields)
        resolve(fields)
    }).catch(err => {
        console.log(err)
        reject(err)
    })
    })
    
}

const WiscITRouter = express.Router()

WiscITRouter.get('/fields', (req, res) => {
    login()
    .then(token => {
        getIncidentFields(token.access_token)
        .then(fields => {
            res.json(fields)
        })
    })
})

module.exports = WiscITRouter