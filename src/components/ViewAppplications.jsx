import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ViewApplication.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import logo from './images/Mnit_logo.png';
import * as XLSX from 'xlsx'; // Import the xlsx library
import ApplicationStatus from './Application_status';

const ViewApplicationsPage = () => {
  const {internshipId, username } = useParams();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [editingStatus, setEditingStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [filter, setFilter] = useState("all");
  

  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/students/students/`);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      const filteredApps = data.filter(application => String(application.i_id) === String(internshipId));
      setApplications(filteredApps.sort((a, b) => a.id - b.id));
      applyFilter(filter, filteredApps);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [internshipId]);

  const handleEdit = (application) => {
    setEditingStatus(application);
    setNewStatus(application.status);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/students/students/${editingStatus.id}/update_status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      const updatedStatus = await response.json();
      setApplications(prevApplications => {
        const updatedApps = prevApplications.map(app => app.id === updatedStatus.id ? updatedStatus : app);
        return updatedApps.sort((a, b) => a.id - b.id); 
      });
      setEditingStatus(null);
      fetchApplications();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingStatus(null);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleLogout = () => {
    navigate('/internship_portal');
  };

  const applyFilter = (filter, applications) => {
    let filtered = applications;
    if (filter === "shortlisted") {
      filtered = applications.filter(app => app.status === "Shortlisted");
    } else if (filter === "not_shortlisted") {
      filtered = applications.filter(app => app.status === "Not Shortlisted");
    }
    else if (filter === "all") {
      filtered= applications;
    }
    
    setFilteredApplications(filtered);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilter(newFilter, applications);
  };

  const handleShowDetails = (id) => {
    console.log("hi");
    console.log(id);
    const application = filteredApplications.find(application => application.id === parseInt(id));
    setSelectedApplication(application);
    console.log(selectedApplication);
  };

  const handleCloseDetails = () => {
    setSelectedApplication(null);
  };

  const handleExportToExcel = () => {

    const filteredApplications = applications.map(({ id, i_id, user_id, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(filteredApplications);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

    // Trigger a download of the Excel file
    XLSX.writeFile(workbook, 'Applications.xlsx');
  };

  return (
    <div>
      {/* <header>
        <div className="MNIT_name">
          <img src={logo} alt="MNIT logo" />
          <h1>
            मालवीय राष्ट्रीय प्रौद्योगिकी संस्थान जयपुर (राष्ट्रीय महत्व का संस्थान)
            <br />
            Malaviya National Institute of Technology Jaipur (An Institute of National Importance)
          </h1>
        </div>
      </header> */}
      <header>
        <h1>Internship Web Portal</h1>
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
      <h3>Applications for Internship</h3>
      
      {/* <button onClick={handleExportToExcel} className="download-button">Download Excel</button> */}
      <div className='colomn'>
        <button className={`colomn-1 ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilterChange("all")}>All Applications</button>
        <button className={`colomn-2 ${filter === 'shortlisted' ? 'active' : ''}`} onClick={() => handleFilterChange("shortlisted")}>Shortlisted</button>
        <button className={`colomn-3 ${filter === 'not_shortlisted' ? 'active' : ''}`} onClick={() => handleFilterChange("not_shortlisted")}>Not Shortlisted</button>
      </div>
      <div className="table-container">
        {filteredApplications.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Resume</th>
                <th>Id Card</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(application => (
                <tr key={application.id}>
                  <td>{application.first_name} {application.last_name}</td>
                  <td>{application.email}</td>
                  <td><a href={application.resume} target="_blank" rel="noopener noreferrer">View</a></td>
                  <td><a href={application.idCard} target="_blank" rel="noopener noreferrer">View</a></td>
                  <td className="status-cell">
                    {editingStatus && editingStatus.id === application.id ? (
                      <div className="status-actions">
                        <select value={newStatus} onChange={handleStatusChange}>
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Not Shortlisted">Not Shortlisted</option>
                        </select>
                        <button className="save-button" onClick={handleSave}>Save</button>
                        <button type="button" className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        {application.status}
                        <button className="edit-button" onClick={() => handleEdit(application)}>Edit Status</button>
                      </>
                    )}
                  </td>
                  <td><FontAwesomeIcon icon={faInfoCircle} onClick={() => handleShowDetails(application.id)} /></td>
                </tr>
                
              ))}
              {selectedApplication && (
          <div className="details-card">
            <h2>Application Details</h2>
            <p><strong>First Name:</strong> {selectedApplication.first_name}</p>
            <p><strong>Last Name:</strong> {selectedApplication.last_name}</p>
            <p><strong>Address:</strong> {selectedApplication.adddress}</p>
            <p><strong>Email:</strong> {selectedApplication.email}</p>
            <p><strong>Phone number:</strong> {selectedApplication.phone_number}</p>
            <p><strong>College:</strong> {selectedApplication.college_name}</p>
            <p><strong>Department:</strong> {selectedApplication.department}</p>
            <p><strong>Roll number:</strong> {selectedApplication.roll_no}</p>
            <p><strong>Course:</strong> {selectedApplication.course}</p>
            <p><strong>Skills:</strong> {selectedApplication.skills}</p>
            <p><strong>Additional Skills:</strong> {selectedApplication.addskills}</p>
            <button onClick={handleCloseDetails}>Close</button>
          </div>)}
            </tbody>
          </table>
        ) : (
          <p>No applications found for this internship.</p>
        )}
      </div>
      <div className="add-internship-container">
        
        <button className="add-internship-button" onClick={handleExportToExcel}>Download Excel</button>
        
      </div>
    </div>
  );
};

export default ViewApplicationsPage;
