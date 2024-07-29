
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginRegistrationForm from './components/LoginRegistrationForm';
import Home from './components/Home';  // Assume Home is another component you want to navigate to
import Dashboard from './components/Dashboard';  // Another component, e.g., for logged-in users
import InternshipsPage from './components/Mentor';
import Application_status from './components/Application_status';

function App() {
  const userId = '2';
  // const loggedIn = window.localStorage.getItem("isLoggedIn");

  return (
    
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={ Home} />
          <Route path="/login" component={LoginRegistrationForm} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/mentor" render={(props) => <InternshipsPage userId={userId} />} />
          <Route path="application_status" component={Application_status }></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;