import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import {io} from 'socket.io-client'
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import Chat from './Chat';
var socket = io()



    ReactDOM.render(
        <div>
        <Chat socket={socket}></Chat>
        </div>
    ,
      document.getElementById('root')
    );
    
    if (module.hot) {
      module.hot.accept();
    }