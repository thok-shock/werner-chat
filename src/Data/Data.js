import React, { useEffect } from 'react'
import { useState } from 'react'
import { Col, DropdownButton, Form, Nav, Navbar, Row, Table } from 'react-bootstrap'

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
            acmeCountHoursByAgentData[agent] = i/2
        }
        return acmeCountHoursByAgentData
            
    }
}

function renderTotalHoursRows(data, shiftNames, selectedTeams) {
    if (data && shiftNames && shiftNames.length > 0) {
        let countedHours = countHoursByAgent(data)
        let countedHoursJSONArray = []
        for (const agent in countedHours) {
            countedHoursJSONArray.push({agent: agent, hours: countedHours[agent]})
        }
        let formattedShiftNames = shiftNames.map((row) => {
            if (row.team_name) {row.team_name = row.team_name.toString().split(',')}
            if (row.training_levels) {row.training_levels = row.training_levels.toString().split(',')}
            if (row.team_name) {
            let newTeamNames = row.team_name.map(value => {
                return value.trim()
            })
            row.team_name = newTeamNames
        }
            if (row.training_levels) {
                let newTrainingLevels = row.training_levels.map(value => {
                    return value.trim()
                })
                row.newTrainingLevels = newTrainingLevels
    
            }
            
            return row
        })
        let namedCountedHoursJSONArray = countedHoursJSONArray.map((row) => {
            let mergedRow = []
            formattedShiftNames.forEach(shiftNameRow => {
                if (shiftNameRow.Employee_ID == row.agent) {
                    var duplicateAcmeHours = JSON.parse(JSON.stringify(row))
                    var duplicateAcmePeople = JSON.parse(JSON.stringify(shiftNameRow))
                    mergedRow = {...duplicateAcmeHours, ...duplicateAcmePeople}
                }
                
            })
            return mergedRow
        })

        let allowedTeams = []
        for (const team in selectedTeams) {
            if (selectedTeams[team] === "on")
            allowedTeams.push(team)
        }
        //console.log(allowedTeams)
        let filteredNamedCountedHoursJSONArray = namedCountedHoursJSONArray.filter(row => {
            var passed = false
            allowedTeams.forEach(value => {
                //console.log(row.team_name)
                //console.log(row.team_name.includes(value))
                if (row.team_name) {
                    if (row.team_name.includes(value)) {
                        passed = true
                    }
                }
            })
            return passed
        })
        //console.log(filteredNamedCountedHoursJSONArray)

        let sortedFilteredNamedCountedHoursJSONArray = filteredNamedCountedHoursJSONArray.sort((a, b) => {
            if (a.hours == b.hours) {
                return 0
            }
            return a.hours < b.hours ? 1 : -1
        })
        return sortedFilteredNamedCountedHoursJSONArray.map((row) => {
            if (row && row.hours) {
            return <tr key={row.agent}><td>{row.First_Name} {row.Last_Name}</td><td>{row.hours}</td><td>{row.team_name.toString()}</td></tr>
            }
        })
    } else {
        console.log('Not enough information to log')
    }
}

function renderTeamTypes(teams, updateTeams) {
    if (teams && teams.length >0) {
        return teams.map(team => {
            return <Form.Check type='checkbox' key={team.Team_ID} label={team.Team_Name} id={team.Team_Name} onChange={updateTeams} defaultChecked={team.Team_Name === 'GenHD' ? true : false}></Form.Check>
        }) 
    }   
}

export default function Data(props) {
    const [dateRange, updateDateRange] = useState(['2021-04-01', '2021-04-30'])
    const [incidentFields, updateIncidentFields] = useState({})
    const [acmeShifts, updateAcmeShifts] = useState([])
    const [acmeShiftsAgg, updateAcmeShiftsAgg] = useState([])
    const [acmeRoles, updateAcmeRoles] = useState({})
    const [acmeShiftNames, updateAcmeShiftNames] = useState({})
    const [acmeTeams, updateAcmeTeams] = useState({})
    const [selectedTeams, updateSelectedTeams] = useState({
        GenHD: "on"
    })

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
    }, [dateRange])

    useEffect(() => {
        countHoursByAgent(acmeShifts)
    }, [acmeShifts])

    useEffect(() => {
        fetch('/api/acme/shiftNames')
        .then(res => res.json())
        .then(res => updateAcmeShiftNames(res))
    }, [])

    useEffect(() => {
        fetch('/api/acme/teamNames')
        .then(res => res.json())
        .then(res => {
            updateAcmeTeams(res)
        })
    }, [])

    function updateSelectedTeamsCheckBox(e) {
        if (selectedTeams[e.target.id] == "on") {
            let newSelectedTeams = JSON.parse(JSON.stringify(selectedTeams))
            newSelectedTeams[e.target.id] = null
            updateSelectedTeams(newSelectedTeams)
        } else {
            let newSelectedTeams = JSON.parse(JSON.stringify(selectedTeams))
            newSelectedTeams[e.target.id] = e.target.value
            updateSelectedTeams(newSelectedTeams)
        }
    }

    function updateDateRanges(side, value) {
        let newArray = dateRange.map((value) => {
            return value
        })
        if (side === 'start') {
            newArray[0] = value
        } else {
            newArray[1] = value
        }
        updateDateRange(newArray)
    }

    return <div>
        <Navbar bg='dark' variant='dark'>
            <Navbar.Brand>
                SWIS2 DATAVIS
            </Navbar.Brand>
            <Nav className='mr-auto'>
                <Nav.Link>Home</Nav.Link>
            </Nav>
        </Navbar>
        <div style={{backgroundColor: 'lightgray'}} className='mx-3 p-3 shadow'>
            <Row>
                <Col className='m-3'>
                    <div className='d-flex' style={{justifyContent: 'flex-end'}}>
                                <Form className='my-3 mx-2'><Form.Control type='date' value={dateRange[0]} onChange={e => {updateDateRanges('start', e.target.value)}}></Form.Control></Form>
                                <p className='align-self-center m-0'>to</p>
                                <Form className='my-3 mx-2'><Form.Control type='date' value={dateRange[1]} onChange={e => {updateDateRanges('end', e.target.value)}}></Form.Control></Form>
                            
                            
                    <DropdownButton title='Filter Teams' className='my-3 mx-2'>
                        
                    <Form className='m-2'>
                        <Form.Group>
                            {renderTeamTypes(acmeTeams, updateSelectedTeamsCheckBox)}
                            </Form.Group>
                    </Form>
                    </DropdownButton>
                    </div>
                <Table striped bordered hover size='sm' variant='light'>
                <thead>
                    <tr>
                        <td>Agent ID</td>
                        <td>Total Hours</td>
                        <td>Team Name</td>
                        </tr>
                </thead>
                <tbody>
                    {renderTotalHoursRows(acmeShifts, acmeShiftNames, selectedTeams)}
                </tbody>
            </Table>
                </Col>
            </Row>
            
        </div>
    </div>
}