import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './Application_status.css';
import logo from './images/Mnit_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const ApplicationStatus = () => {
  const [students, setStudents] = useState([]);
  const [internshipDetails, setInternshipDetails] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const { userId, username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [userId]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/students/students/');
      if (!response.ok) {
        throw new Error('Failed to fetch students data');
      }
      const data = await response.json();
      const filteredStudents = data.filter(student => student.user_id === userId);
      setStudents(filteredStudents);

      const internshipPromises = filteredStudents.map(student =>
        fetch(`http://127.0.0.1:8000/internships/${student.i_id}/`)
          .then(res => {
            if (!res.ok) {
              throw new Error(`Failed to fetch internship ${student.i_id}`);
            }
            return res.json();
          })
          .catch(error => {
            console.error('Error fetching internship:', error);
            return null; // Return null if there's an error
          })
      );

      const internshipsData = await Promise.all(internshipPromises);
      const validInternships = internshipsData.filter(internship => internship !== null); // Filter out null values
      // console.log(validInternships);
      setInternshipDetails(validInternships);
    } catch (error) {
      console.error('Error fetching students data:', error);
    }
  };

  const getInternshipDetails = (internshipId) => {
    // console.log('Internship Details State:', internshipDetails);
    const internship = internshipDetails.find(internship => internship.id === parseInt(internshipId));
    // console.log('Internship ID:', internshipId, 'Matched Internship:', internship);
    return internship ? { title: internship.Title, mentor: internship.Mentor, description: internship.Description } : { title: 'N/A', mentor: 'N/A', description: 'N/A' };
  };

  const handleLogout = () => {
    navigate('/internship_portal');
  };

  const handleShowDetails = (internshipId) => {
    console.log(internshipId);
    const internship = internshipDetails.find(internship => internship.id === parseInt(internshipId));
    setSelectedInternship(internship);
    console.log(selectedInternship);
  };

  const handleCloseDetails = () => {
    setSelectedInternship(null);
  };

  return (
    <>
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
      <nav className="navbar3">
        <div className="navbar-left">
          <Link className="home" to="/internship_portal">Home</Link>
        </div>
        <div className="navbar-right">
          <span className="username"><FontAwesomeIcon icon={faUser} /> {username}</span>
          <button className="logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </button>
        </div>
      </nav>
      <div className="application-status-container">
        <h1>My Applications</h1>
        <table>
          <thead>
            <tr>
              <th>Internship Title</th>
              <th>Mentor Name</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const { title, mentor, description } = getInternshipDetails(student.i_id);
              return (
                <tr key={student.id}>
                  <td>{title}</td>
                  <td>{mentor}</td>
                  <td>{student.status}</td>
                  <td>
                    <FontAwesomeIcon icon={faInfoCircle} onClick={() => handleShowDetails(student.i_id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {selectedInternship && (
          <div className="details-card">
            <h2>Internship Details</h2>
            <p><strong>Title:</strong> {selectedInternship.Title}</p>
            <p><strong>Mentor:</strong> {selectedInternship.Mentor}</p>
            <p><strong>Description:</strong> {selectedInternship.Description}</p>
            <p><strong>Duration:</strong> {selectedInternship.Duration}</p>
            <p><strong>Stipend:</strong> {selectedInternship.Stipend}</p>
            <p><strong>Internship Status:</strong> {selectedInternship.Status}</p>
            <p><strong>Skills Required:</strong> {selectedInternship.Skills}</p>
            <button onClick={handleCloseDetails}>Close</button>
          </div>
        )}
      </div>
    </>
  );
};

export default ApplicationStatus;
