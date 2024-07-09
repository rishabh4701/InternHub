// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginRegistrationForm from './components/LoginRegistrationForm';
import Home from './components/Home';  // Assume Home is another component you want to navigate to
import Dashboard from './components/Dashboard';  // Another component, e.g., for logged-in users

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={LoginRegistrationForm} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

//http://172.18.13.26:8000/auth/login/
//http://172.18.13.26:8000/auth/signup/
//http://172.18.13.21:8000/internships/