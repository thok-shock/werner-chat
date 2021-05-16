import React, { useEffect } from 'react'
import { useState } from 'react'
import { Col, Nav, Navbar, Row, Table } from 'react-bootstrap'

function renderDataTypes(dataTypes) {
    if (dataTypes) {
    return dataTypes.map(type => {
        return <p className='m-0'>{type.displayName}</p>
    })
}
}

function breakdownDataByAgent(data) {
    if (data) {
    const obj = {}
    const newArray = data.map((row) => {
        //console.log(row)
        if (!obj[row.agent]){
        obj[row.agent] = {...obj[row.agent], [row.date]: {[row.shift]: row.duration}}
        } else {
            obj[row.agent] = {...obj[row.agent], [row.date]: {...obj[row.agent].[row.date], [row.shift]: row.duration}}
        }
    })
    return obj
}
}

function countHoursByAgent(data) {
    if (data) {
        let acmeCountHoursByAgentData = {}
        for (const agent in data) {
            var i = 0
            for (const date in data[agent]) {
                for (const shift in data[agent][date]){
                    i += data[agent][date][shift]
            }}
            acmeCountHoursByAgentData[agent] = i
        }
        return acmeCountHoursByAgentData
            
    }
}

function renderTotalHoursRows(data, shiftNames) {
    if (data && shiftNames) {
        let countedHours = countHoursByAgent(data)
        let countedHoursJSONArray = []
        for (const agent in countedHours) {
            countedHoursJSONArray.push({agent: agent, hours: countedHours[agent]})
        }
        let namedCountedHoursJSONArray = countedHoursJSONArray.map((row) => {
            let mergedRow = []
            shiftNames.forEach(shiftNameRow => {
                if (shiftNameRow.Employee_ID == row.agent) {
                    var duplicateAcmeHours = JSON.parse(JSON.stringify(row))
                    var duplicateAcmePeople = JSON.parse(JSON.stringify(shiftNameRow))
                    mergedRow = {...duplicateAcmeHours, ...duplicateAcmePeople}
                }
                
            })
            return mergedRow
        })
        let sortedNamedCountedHoursJSONArray = namedCountedHoursJSONArray.sort((a, b) => {
            if (a.hours == b.hours) {
                return 0
            }
            return a.hours < b.hours ? 1 : -1
        })
        return sortedNamedCountedHoursJSONArray.map((row) => {
            if (row && row.hours) {
            return <tr key={row.agent}><td>{row.First_Name} {row.Last_Name}</td><td>{row.hours}</td></tr>
            }
        })
    } else {
        console.log('Not enough information to log')
    }
}

export default function Data(props) {
    const [dateRange, updateDateRange] = useState(['2020-01-01', '2020-01-31'])
    const [incidentFields, updateIncidentFields] = useState({})
    const [acmeShifts, updateAcmeShifts] = useState([])
    const [acmeShiftsAgg, updateAcmeShiftsAgg] = useState([])
    const [acmeRoles, updateAcmeRoles] = useState({})
    const [acmeShiftNames, updateAcmeShiftNames] = useState({})

    useEffect(() => {
        fetch('/api/wiscit/fields')
        .then(res => {
            return res.json()
        })
        .then(res => {
            updateIncidentFields(res)
        })
    }, [])

    useEffect(() => {
        fetch('/api/acme/shifts?startDate=' + dateRange[0]+ '&endDate=' + dateRange[1])
        .then(res => {
            return res.json()
        })
        .then(res => {updateAcmeShifts(breakdownDataByAgent(res))})
    }, [])

    useEffect(() => {
        countHoursByAgent(acmeShifts)
    }, [acmeShifts])

    useEffect(() => {
        fetch('/api/acme/shiftNames')
        .then(res => res.json())
        .then(res => updateAcmeShiftNames(res))
    }, [])

    return <div>
        <Navbar bg='dark' variant='dark'>
            <Navbar.Brand>
                SWIS2 DATAVIS
            </Navbar.Brand>
            <Nav className='mr-auto'>
                <Nav.Link>Home</Nav.Link>
            </Nav>
        </Navbar>
        <div style={{backgroundColor: 'lightgray'}} className='mx-3 p-3'>
            <Row>
                <Col className='m-3'>
                <Table striped bordered hover size='sm' variant='light'>
                <thead>
                    <tr>
                        <td>Agent ID</td>
                        <td>Total Hours</td>
                        </tr>
                </thead>
                <tbody>
                    {renderTotalHoursRows(acmeShifts, acmeShiftNames)}
                </tbody>
            </Table>
                </Col>
            </Row>
            
        {renderDataTypes(incidentFields.fields)}
        </div>
    </div>
}