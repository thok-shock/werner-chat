import React from 'react'
import { useState } from 'react'
import { Nav, Navbar } from 'react-bootstrap'

function renderDataTypes() {

}

export default function Data(props) {
    const [incidentFields, updateIncidentFields] = useState([])
    return <div>
        <Navbar bg='dark' variant='dark'>
            <Navbar.Brand>
                SWIS2 DATAVIS
            </Navbar.Brand>
            <Nav className='mr-auto'>
                <Nav.Link>Home</Nav.Link>
            </Nav>
        </Navbar>
        <div style={{backgroundColor: 'lightgray'}} className='mx-3 px-3'>
        <p>text</p>
        </div>
    </div>
}