import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'

export default function HDQA(props) {
    return (<Container fluid>
        <Row>
            <Col md='2'>
                <div className='text-center'>
                <img src='/public/ryan.jpg' width='100%' className='rounded-circle'></img>
                <h4 className='m-2'>Ryan Werner</h4>
                </div>
                <div className='text-center mt-3'>
                    <p>Sunday, April 25th, 3:04 PM</p>
                    <p>03:46 remaining on shift</p>
                    <p>1,231 HDQA hours</p>
                </div>
            </Col>
            <Col md='8'>
                <Card className='m-3'>
                    <Card.Header>
                        <h3>Getting Started</h3>
                    </Card.Header>
                    <Card.Body>
                        this is the body
                    </Card.Body>
                </Card>
                <Card className='m-3'>
                    <Card.Header>
                        <h3>Check Attendance - 00:27</h3>
                    </Card.Header>
                    <Card.Body>
                        this is the body
                    </Card.Body>
                </Card>
            </Col>
            <Col md='2'>

            </Col>
        </Row>
    </Container>)
}