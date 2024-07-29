import React, { useState, useEffect } from 'react';
import './Application_status.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const Application_status = ({ loggedInUser }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState('');
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/internships/')
      .then(response => setJobs(response.data))
      .catch(error => console.error('There was an error fetching the jobs!', error));
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      axios.get(`http://127.0.0.1:8000/students/students/${loggedInUser}`)
        .then(response => {
          console.log('Response data:', response.data); // Log the response data
          setApplications(response.data.applications || []);
          setStatus(setApplications.status);
        })
        .catch(error => console.error('There was an error fetching the applications!', error));
    }
  }, [loggedInUser]);

  const getStatusForJob = (jobId) => {
    const application = applications.find(app => app.i_id === jobId);
    return application ? application.status : 'Not Applied';
  };

  return (
    <div className='ap'>
      <h1>MY Application</h1>
      <div className="tab-content">
        <div id="tab-1" className="tab-pane fade show p-0 active">
          {jobs.map((job, index) => (
            <div key={index} className="job-item p-4 mb-4">
              <div className="row g-4">
                <div className="col-sm-12 col-md-8 d-flex align-items-center">
                  <div className="text-start ps-4">
                    <h2 className="mb-3">{job.Title}</h2>
                    <span className="text-truncate me-3">
                      <FontAwesomeIcon icon={faUserAlt} className="text-primary me-2" /> {job.Mentor}
                    </span>
                  </div>
                </div>
                <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                  <div className="d-flex mb-3">
                    <span className="btn">{getStatusForJob(job.id)}</span>
                  </div>
                  <small className="text-truncate">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-primary me-2" /> Duration: {job.Duration}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Application_status;
