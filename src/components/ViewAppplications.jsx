import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import './ViewApplication.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import logo from './images/Mnit_logo.png';

const ViewApplicationsPage = () => {
  const {internshipId, username } = useParams();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [editingStatus, setEditingStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [filter, setFilter] = useState("all");

  const history = useHistory();

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
    history.push('/');
  };

  const applyFilter = (filter, applications) => {
    let filtered = applications;
    if (filter === "shortlisted") {
      filtered = applications.filter(app => app.status === "Shortlisted");
    } else if (filter === "not_shortlisted") {
      filtered = applications.filter(app => app.status === "Not Shortlisted");
    }
    else if (filter === "all") {
      filtered= applications.filter(app => app.status === "Applied");
    }
    
    setFilteredApplications(filtered);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilter(newFilter, applications);
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
      <nav className="navbar3">
        <div className="navbar-left">
          <Link className="home" to="/">Home</Link>
        </div>
        <div className="navbar-right">
          <span className="username"><FontAwesomeIcon icon={faUser} /> {username}</span>
          <button className="logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </button>
        </div>
      </nav>
      <h3>Applications for Internship {internshipId}</h3>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(application => (
                <tr key={application.id}>
                  <td>{application.first_name} {application.last_name}</td>
                  <td>{application.email}</td>
                  <td><a href={application.resume} target="_blank" rel="noopener noreferrer">View</a></td>
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
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No applications found for this internship.</p>
        )}
      </div>
    </div>
  );
};

export default ViewApplicationsPage;
