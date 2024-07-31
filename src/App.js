
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginRegistrationForm from './components/LoginRegistrationForm';
import Home from './components/Home';  // Assume Home is another component you want to navigate to
import Dashboard from './components/Dashboard';  // Another component, e.g., for logged-in users
//import InternshipsPage from './components/Mentor';
import Application_status from './components/Application_status';
import MentorPage from './components/Mentor';
import ViewApplications from './components/ViewAppplications'

function App() {
  const userId = '1';
  return (
    
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={ Home} />
          <Route path="/login" component={LoginRegistrationForm} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/mentor/:userId/:username" component={MentorPage} />
          <Route path="application_status" component={Application_status } />
          {/* <Route path="/mentor" render={(props) => <InternshipsPage userId={userId} />} /> */}
          <Route path="/mentor/:userId/:username" component={MentorPage} />
          <Route path="/applications/:internshipId" component={ViewApplications} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;