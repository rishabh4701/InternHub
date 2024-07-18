import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import './Home_page.css';

const InternshipsPage = ({ userId }) => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/internships/');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setInternships(data);
      filterInternships(data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

  const filterInternships = (internshipsData) => {
    if (userId) {
      const filtered = internshipsData.filter(internship => internship.user_id === userId);
      setFilteredInternships(filtered);
    } else {
      setFilteredInternships(internshipsData);
    }
  };

  return (
    <div>
      <h1>Internships</h1>
      <div className="tab-content">
        <div id="tab-1" className="tab-pane fade show p-0 active">
        {filteredInternships.map(internship => (
          <div className="job-item p-4 mb-4">
          <div className="row g-4">
            <div className="col-sm-12 col-md-8 d-flex flex-row align-items-start align-items-md-end justify-content-center">
              <div className="text-start ps-4" id='internships'>
                <h2 className="mb-3">{internship.Title}</h2>
                <div className="d-flex">
                  <span className="badge bg-secondary">{internship.Status}</span>
                </div>
                <span className="text-truncate me-3">
                  <FontAwesomeIcon icon={faUserAlt} className="text-primary me-2" />
                  {internship.Mentor}
                </span>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 d-flex flex-row align-items-start align-items-md-end justify-content-center">
              <div className="d-flex">
                <a className="btn btn-primary" href="#">Edit</a>
              </div>
              <small className="text-truncate">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-primary me-2" />
                Duration: {internship.Duration}
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

export default InternshipsPage;