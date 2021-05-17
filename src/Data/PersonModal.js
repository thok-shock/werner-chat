import React from 'react'
import { Container, Modal, Row, Col } from 'react-bootstrap'

export default function PersonModal(props) {
    return <Modal show={props.show} onHide={props.invertExpanded} size='lg'>
        <Modal.Header>
            <Modal.Title>{props.person.First_Name} {props.person.Last_Name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
                <Row>
                    <Col><img src={'https://acme.wisc.edu/tools/staff/staff_pictures/' + props.person.Login + '.png'} ></img></Col>
                </Row>
            </Container>
        </Modal.Body>
    </Modal>
}