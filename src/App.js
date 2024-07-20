// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginRegistrationForm from './components/LoginRegistrationForm';
import Home from './components/Home';  // Assume Home is another component you want to navigate to
import Dashboard from './components/Dashboard';  // Another component, e.g., for logged-in users
import MentorPage from './components/Mentor';

function App() {
  const userId = '1';
  return (
    
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={LoginRegistrationForm} />
          <Route path="/dashboard" component={Dashboard} />
          {/* <Route path="/mentor" render={(props) => <InternshipsPage userId={userId} />} /> */}
          <Route path="/mentor/:userId" component={MentorPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

//http://172.18.13.26:8000/auth/login/
//http://172.18.13.26:8000/auth/signup/
//http://172.18.13.21:8000/internships/