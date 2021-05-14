import React from 'react'
import ReactDOM from 'react-dom'
import HDQA from './HDQA/HDQA.js'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';

    ReactDOM.render(
        <div>
        <Router>
            <p>switch below</p>
            <Switch>
                <Route path='/hdqa'>
                    <HDQA />
                </Route>
                <Route path='/'>
                    <p>this is a path</p>
                </Route>
            </Switch>
        </Router>
        </div>
    ,
      document.getElementById('root')
    );
    
    if (module.hot) {
      module.hot.accept();
    }