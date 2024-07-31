import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ViewApplication.css';

const ViewApplicationsPage = () => {
  const { internshipId } = useParams();
  const [applications, setApplications] = useState([]);
  const [editingStatus, setEditingStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const fetchApplications = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/students/students/`);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      const filteredApps = data.filter(application => String(application.i_id) === String(internshipId));
      setApplications(filteredApps.sort((a, b) => a.id - b.id)); // Sort by ID in ascending order
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

  return (
    <div>
      <h3>Applications for Internship {internshipId}</h3>
      <div className="table-container">
        {applications.length > 0 ? (
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
              {applications.map(application => (
                <tr key={application.id}>
                  <td>{application.first_name} {application.last_name}</td>
                  <td>{application.email}</td>
                  <td><a href={application.resume} target="_blank" rel="noopener noreferrer">View</a></td>
                  <td className="status-cell">
                    {editingStatus && editingStatus.id === application.id ? (
                      <div className="status-actions">
                        <select value={newStatus} onChange={handleStatusChange}>
                          <option value="applied">Applied</option>
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
