import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'

export default function Data(props) {
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