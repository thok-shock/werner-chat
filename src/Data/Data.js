import React, { useEffect } from 'react'
import { useState } from 'react'
import { Col, DropdownButton, Form, Nav, Navbar, Row, Table } from 'react-bootstrap'
import PersonRow from './PersonRow'

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

function determinePay(agent) {
    let highestPay = 0
    if (agent.training_levels) {
        let thisPay = 0
        agent.training_levels.forEach(level => {
            switch(level) {
                case "Pick 1":
                    thisPay = 10.25;
                    break;
                case "Pick 3":
                    thisPay = 10.75;
                    break;
                case "Chat/Email":
                    thisPay = 11.25;
                    break;
                case "HDQA":
                    thisPay = 12.00;
            }
            highestPay = thisPay > highestPay ? thisPay : highestPay
        })
        return highestPay
} else {
    return 9.75
}
    }
    

function countHoursByAgent(data, selectedShifts) {
    if (data) {
        let acmeCountHoursByAgentData = {}
        for (const agent in data) {
            var i = 0
            for (const date in data[agent]) {
                for (const shift in data[agent][date]){
                    //console.log(shift)
                    for (const type in selectedShifts) {
                        //console.log(selectedShifts[type])
                        if (selectedShifts[type] == "on" && type == shift) {
                            //console.log(type)
                            i += data[agent][date][shift]
                        }
                    } 
            }}
            acmeCountHoursByAgentData[agent] = i/2
        }
        return acmeCountHoursByAgentData
            
    }
}

function getAgentShiftBreakdown(data, agentID) {
    let foundData = {}
    for (const agent in data) {
        console.log(agent)
        if (agent == agentID) {
            foundData = data[agent]
        }
    }
    return foundData

}

function renderTotalHoursRows(data, shiftNames, selectedTeams, selectedShifts) {
    if (data && shiftNames && shiftNames.length > 0) {
        let countedHours = countHoursByAgent(data, selectedShifts)
        let countedHoursJSONArray = []
        for (const agent in countedHours) {
            countedHoursJSONArray.push({agent: agent, hours: countedHours[agent]})
        }

        //format information about person so that it is in a format that is easy to understand. (e.g. puts team membership of a user in an array)
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
                    //this turns out to be very important, as otherwise there is an extra space that messes things up when filtering later on
                    return value.trim()
                })
                row.training_levels = newTrainingLevels
            }
            row.pay = determinePay(row)
            row.shiftBreakdown = getAgentShiftBreakdown(data, row.Employee_ID)
            
            return row
        })


        //add information about person to ID gathered from data view
        let namedCountedHoursJSONArray = countedHoursJSONArray.map((row) => {
            let mergedRow = []
            formattedShiftNames.forEach(shiftNameRow => {
                if (shiftNameRow.Employee_ID == row.agent) {
                    var duplicateAcmeHours = JSON.parse(JSON.stringify(row))
                    var duplicateAcmePeople = JSON.parse(JSON.stringify(shiftNameRow))
                    //merges the two data sources together
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
                return <PersonRow person={row}></PersonRow>
            //return <tr key={row.agent}><td>{row.First_Name} {row.Last_Name}</td><td>{row.hours}</td><td>{row.team_name.toString()}</td><td>${row.pay.toFixed(2)}</td></tr>
            }
        })
    } else {
        console.log('Not enough information to log')
    }
}

function renderTeamTypes(teams, updateTeams) {
    if (teams && teams.length > 0) {
        return teams.map(team => {
            return <Form.Check type='checkbox' key={team.Team_ID} label={team.Team_Name} id={team.Team_Name} onChange={updateTeams} defaultChecked={team.Team_Name === 'GenHD' ? true : false}></Form.Check>
        }) 
    }   
}

function renderShiftTypes(shiftTypes, updateSelectedShiftTypes, acmeTeams) {
    if (shiftTypes && shiftTypes.length > 0) {
        let prevType = null
        return shiftTypes.map(shiftType => {
            if (shiftType.Group_ID != prevType) {
                prevType = shiftType.Group_ID
                let team = acmeTeams.find(team => {
                    //console.log(team.Team_ID + ' ' + shiftType.Group_ID)
                    if (team.Group_ID === shiftType.Group_ID) {
                        return true
                    }
                })
                //console.log(team)
                return <div>
                    <p style={{fontWeight: 'bold'}} className='m-3 text-center'>{
                        team && team.Team_Name
                    }</p>
                    <Form.Check type='checkbox' key={shiftType.id} label={shiftType.display} id={shiftType.id} onChange={updateSelectedShiftTypes} defaultChecked={shiftType.active == 1 ? true : false}></Form.Check>
                </div>
            }
            return <Form.Check type='checkbox' key={shiftType.id} label={shiftType.display} id={shiftType.id} onChange={updateSelectedShiftTypes} defaultChecked={shiftType.active == 1 ? true : false}></Form.Check>
        }) 
    }   
}

function renderTableTotals() {
    let total = 0
                    let table = document.getElementById('hoursTable')
                    //console.log(table.rows.length)
                    for (var i = 1; i < table.rows.length - 1; i++) {
                        let money = parseFloat(table.rows[i].cells[4].innerHTML.substring(1))
                        //console.log(money)
                        total = total + money
                    }
                    return total.toFixed(2)
}

export default function Data(props) {
    const [dateRange, updateDateRange] = useState(['2021-04-29', '2021-04-30'])
    const [incidentFields, updateIncidentFields] = useState({})
    const [acmeShifts, updateAcmeShifts] = useState([])
    const [acmeShiftsAgg, updateAcmeShiftsAgg] = useState([])
    const [acmeRoles, updateAcmeRoles] = useState({})
    const [acmeShiftNames, updateAcmeShiftNames] = useState({})
    const [acmeTeams, updateAcmeTeams] = useState({})
    const [selectedTeams, updateSelectedTeams] = useState({
        GenHD: "on"
    })
    const [acmeShiftTypes, updateAcmeShiftTypes] = useState({})
    const [selectedShifts, updateSelectedShifts] = useState({})
    const [loading, updateLoading] = useState(true)
    const [tableTotal, updateTableTotal] = useState(0.00)

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
        updateLoading(false)
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

    useEffect(() => {
        fetch('/api/acme/shiftTypes')
        .then(res => res.json())
        .then(res => {
            updateAcmeShiftTypes(res)
            let newObj = {}
            res.forEach(type => {
                if (type.active == 1) {
                    newObj = {...newObj, [type.id]: "on"}
                }
            })
            updateSelectedShifts(newObj)
        })
    }, [])

    useEffect(() => {
        console.log(renderTableTotals())
        updateTableTotal(renderTableTotals())
    })



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

    function updateSelectedShiftTypes(e) {
        console.log(e.target.id)
        if (selectedShifts[e.target.id] == "on") {
            let newSelectedShifts = JSON.parse(JSON.stringify(selectedShifts))
            newSelectedShifts[e.target.id] = null
            updateSelectedShifts(newSelectedShifts)
        } else {
            let newSelectedShifts = JSON.parse(JSON.stringify(selectedShifts))
            newSelectedShifts[e.target.id] = e.target.value
            updateSelectedShifts(newSelectedShifts)
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
                    <DropdownButton title='Filter Shift Types' className='my-3 mx-2'>
                        <Form className='m-2'>
                            <Form.Group>
                                {renderShiftTypes(acmeShiftTypes, updateSelectedShiftTypes, acmeTeams)}
                            </Form.Group>
                        </Form>
                    </DropdownButton>
                    </div>
                <Table id='hoursTable' striped bordered hover size='sm' variant='light' onClick={(e) => {console.log(renderTableTotals())}}>
                <thead>
                    <tr style={{fontWeight: 'bold'}}>
                        <td>Agent ID</td>
                        <td>Total Hours</td>
                        <td>Team Name</td>
                        <td>Wage ($/hr)</td>
                        <td>Total Cost</td>
                        </tr>
                </thead>
                <tbody>
                    {renderTotalHoursRows(acmeShifts, acmeShiftNames, selectedTeams, selectedShifts, updateLoading)}
                    <tr><td></td><td></td><td></td><td></td><td style={{fontWeight: 'bold'}}>${tableTotal}</td></tr>
                </tbody>
            </Table>
                </Col>
            </Row>
            
        </div>
    </div>
}