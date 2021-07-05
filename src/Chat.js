import React, { useEffect, useRef, useState } from 'react'
import { Button, Container, Form, Row, Col, Navbar } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"

function renderMessages(messages) {
    if (messages && messages.length > 0) {
    return messages.map(message => {
        if (message.time) {
            const msgDate = new Date(message.time)

            return <div key={message.time.toLocaleString()} className='d-flex flex-row'><p> {msgDate.toLocaleString() + ': '}</p><p className='ml-1'>{' ' +message.message}</p></div>
        }
        
    })}
}

export default function Chat(props) {


    const [draft, updateDraft] = useState('')
    const [messages, updateMessages] = useState([])
    const messagesRef = useRef(messages)

    useEffect(() => {
        messagesRef.current = messages
    })

    useEffect(() => {
        const handler = (message) => {
            messageHandler(message, messagesRef.current, updateMessages)
        }

        props.socket.on('new message', handler)
            return () => {
                socket.off('new message', handler)
            }
        
    }, [])

    const messageHandler = (message, messages, updateMessages) => {
        updateMessages([...messages, message])
    }



    

return <Router>
            
            <Switch>
                <Route path='/'>
                <Navbar bg='light'>
                                <Navbar.Brand >Werner Chat</Navbar.Brand>
                            </Navbar>
                    <Container fluid >
                        
                            
                        
                        <Row>
                            <Col>
                            {renderMessages(messages)}
                            </Col>

                        </Row>
                        <Row className='fixed-bottom mx-1'>
                            <Col style={{border: '1px solid black'}}>
                    <Form>
                        <Form.Row>
                            <Form.Group>
                                <Form.Label>Enter a message</Form.Label>
                                <div className='d-flex flex-row'>
                                <Form.Control className='mr-2' value={draft} onChange={e => {updateDraft(e.target.value)}}></Form.Control>
                                <Button onClick={e => {props.socket.emit('msg', draft, new Date())}}>Send</Button>
                                </div>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                    </Col>
                    </Row>
                    </Container>
                    
                </Route>
            </Switch>
        </Router>
}