// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home_page.css';  // Adjust the path as needed
//mport 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import logo from './images/Mnit_logo.png';  // Adjust the path as needed
import userIcon from './images/icons8-user-50.png';  // Adjust the path as needed
import LoginRegistrationForm from './LoginRegistrationForm';  // Adjust the path as needed

const Home = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    axios.get('http://172.18.13.21:8000/internships/')
      .then(response => {
        setJobs(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the jobs!', error);
      });
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div>
      <header>
        <div className="MNIT_name">
          <img src={logo} alt="MNIT logo" />
          <h1>
            मालवीय राष्ट्रीय प्रौद्योगिकी संस्थान जयपुर (राष्ट्रीय महत्व का संस्थान)
            <br />
            Malaviya National Institute of Technology Jaipur (An Institute of National Importance)
          </h1>
        </div>
      </header>

      <nav className="navbar">
        <ul>
          <li><a className="home" href="#">Home</a></li>
          <li><a className="about" href="#">About</a></li>
          <li><a className="contact" href="#">Contact</a></li>
          <div className="user" onClick={handleLoginClick}>
            <img src={userIcon} alt="login" />
          </div>
        </ul>
      </nav>

      <div className="tab-content">
        <div id="tab-1" className="tab-pane fade show p-0 active">
          {jobs.map((job, index) => (
            <div key={index} className="job-item p-4 mb-4" onClick={() => setSelectedJob(job)}>
              <div className="row g-4">
                <div className="col-sm-12 col-md-8 d-flex align-items-center">
                  <div className="text-start ps-4">
                    <h2 className="mb-3">{job.Title}</h2>
                    <span className="text-truncate me-3"><FontAwesomeIcon icon={faUserAlt} className="text-primary me-2" />{job.Mentor}</span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                  <div className="d-flex">
                    <a className="btn btn-primary" href="#">Apply Now</a>
                  </div>
                  <small className="text-truncate"><FontAwesomeIcon icon={faCalendarAlt} className="text-primary me-2" />Duration: {job.Duration}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedJob && (
        <div id="job-popup" className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setSelectedJob(null)}>&times;</span>
            <h2 id="job-Title">{selectedJob.Title}</h2>
            <p id="job-description">Cyber security, Embedded systems.</p>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <LoginRegistrationForm closeModal={handleCloseLoginModal} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
