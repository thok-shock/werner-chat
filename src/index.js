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
import Data from './Data/Data.js';

    ReactDOM.render(
        <div>
        <Router>
            <Switch>
                <Route path='/hdqa'>
                    <HDQA />
                </Route>
                <Route path='/data'>
                    <Data />
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