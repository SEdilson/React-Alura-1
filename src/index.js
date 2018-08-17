import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AutorAdmin from './Autor';
import LivroAdmin from './Livro';
import Home from './Home';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

ReactDOM.render(
    (<Router>
        <App>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/autor" component={AutorAdmin}/>
                <Route path="/livro" component={LivroAdmin}/>
            </Switch>
        </App>
    </Router>),
    document.getElementById('root')    
);
