import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegistrationForm from './components/LoginRegistrationForm';
import Home from './components/Home';  
import Dashboard from './components/Dashboard';
import Application_status from './components/Application_status';
import MentorPage from './components/Mentor';
import AdminPage from './components/Admin';
import ViewApplications from './components/ViewAppplications';
import Users from './components/Users';
import Otp from './components/Otp';

function App() {
  const userId = '1';

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/internship_portal" element={<Home />} />
          <Route path="/users/:token" element={<Users />} />
          <Route path="/login" element={<LoginRegistrationForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mentor/:userId/:username" element={<MentorPage />} />
          <Route path="/admin/:userId/:username/:token" element={<AdminPage />} />
          <Route path="/application_status/:userId/:username" element={<Application_status />} />
          <Route path="/applications/:username/:internshipId" element={<ViewApplications />} />
          <Route path="/Otp" element={<Otp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
