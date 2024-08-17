import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Mentor.css';
import logo from './images/Mnit_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const MentorPage = (props) => {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [editingInternshipId, setEditingInternshipId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { userId, username, i_id } = useParams(); // Destructure params from useParams hook
  const navigate = useNavigate();
  console.log(username);
  console.log(i_id);

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
      const sortedData = data.sort((a, b) => (a.Status === 'Open' ? -1 : 1));
      setInternships(sortedData);
      filterInternships(sortedData);
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

  const filterInternships = (internshipsData) => {
    if (userId) {
      const filtered = internshipsData.filter(internship => 
        internship.user_id === userId && internship.username === username
      );
      setFilteredInternships(filtered);
    } else {
      setFilteredInternships(internshipsData);
    }
  };

  const handleEdit = (internshipId) => {
    setEditingInternshipId(internshipId);
  };

  const status = ['Open', 'Closed'];

  const handleSave = async (updatedInternship) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/internships/${updatedInternship.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInternship),
      });

      if (!response.ok) {
        throw new Error('Failed to update internship');
      }

      // Update local state or fetch data again to reflect changes
      fetchInternships();
      setEditingInternshipId(null); // Clear editing state
    } catch (error) {
      console.error('Error updating internship:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingInternshipId(null);
  };

  const EditForm = ({ internship, onSave, onCancel }) => {
    const [updatedInternship, setUpdatedInternship] = useState({
      ...internship,
      // Skills: internship.Skills.join(', '), // Convert Skills array to a comma-separated string
    });
  

    const handleChange = (e) => {
      const { name, value } = e.target;
      setUpdatedInternship(prevState => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(updatedInternship);
    };

    return (
      <>
      <form className="edit-form-container" onSubmit={handleSubmit}>
        <h3>Edit Internship</h3>
        <label>Title:</label>
        <input
          type="text"
          name="Title"
          value={updatedInternship.Title}
          onChange={handleChange}
        />
        <label>Mentor:</label>
        <input
          type="text"
          name="Mentor"
          value={updatedInternship.Mentor}
          onChange={handleChange}
        />
        <label>Duration:</label>
        <input
          type="text"
          name="Duration"
          value={updatedInternship.Duration}
          onChange={handleChange}
        />
        <label>Status:</label>
        <select
          name="Status"
          value={updatedInternship.Status}
          onChange={handleChange}>
            <option value="" disabled>Status</option>
        {status.map((status, internship) => (
                  <option key={internship.id} value={status}>{status}</option>
        ))}
          </select>

        
        <label>Skills:</label>
        <input
        type="text"
        name="Skills"
        value={updatedInternship.Skills}
        onChange={handleChange}
        placeholder="e.g., JavaScript, Python, React"
      />
        

        
        
         
        <div className="form-buttons">
          <button type="submit" className="save-button">Save</button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      </>
    );
  };

  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    // localStorage.removeItem('authToken'); // Example if using localStorage for auth token

    // Redirect to Home page
    navigate('/internship_portal');
    window.location.reload();
  };

  const navigateToApplicationsPage = (id) => {
    navigate(`/applications/${username}/${id}`);
  };

  const handleAdd = async (newInternship) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/internships/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInternship),
      });

      if (!response.ok) {
        throw new Error('Failed to add internship');
      }

      fetchInternships();
      setShowAddForm(false); // Hide add form
    } catch (error) {
      console.error('Error adding internship:', error);
    }
  };

  const AddForm = ({ onSave, onCancel }) => {
    const [newInternship, setNewInternship] = useState({
      Title: '',
      Mentor: '',
      Duration: '',
      Status: '',
      Stipend: '',
      Description: '',
      Skills:'',
      user_id: userId, // Assuming new internships will have the same user_id
      username: username,
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewInternship(prevState => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(newInternship);
    };
  

    
    return (
      <>
      <form className="add-form-container" onSubmit={handleSubmit}>
        <h3>Add New Internship</h3>
        <label>Title:</label>
        <input
          type="text"
          name="Title"
          value={newInternship.Title}
          onChange={handleChange}
        />
        <label>Mentor:</label>
        <input
          type="text"
          name="Mentor"
          value={newInternship.Mentor}
          onChange={handleChange}
        />
        <label>Duration:</label>
        <input
          type="text"
          name="Duration"
          value={newInternship.Duration}
          onChange={handleChange}
        />
        <label>Stipend:</label>
        <input
          type="text"
          name="Stipend"
          value={newInternship.Stipend}
          onChange={handleChange}
        />
        <label>Description:</label>
        <input
          type="text"
          name="Description"
          value={newInternship.Description}
          onChange={handleChange}
        />
        <label>Status:</label>
        <select
          name="Status"
          value={newInternship.Status}
          onChange={handleChange}
          >
          <option value="" disabled>Status</option>
        {status.map((status, internship) => (
                  <option key={internship.id} value={status}>{status}</option>
        ))}
        </select  >
        <label>Skills (comma-separated):</label>
      <input
        type="text"
        name="Skills"
        value={newInternship.Skills}
        onChange={handleChange}
        placeholder="e.g., JavaScript, Python, React"
      />
      <div className="form-buttons">
        <button type="submit" className="save-button">Add Internship</button>
        <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
      </div>
      </form>
      </>
    );
  };

  const handleShowDetails = (jobId) => {
    console.log("hi");
    console.log(jobId);
    const job = internships.find(job => job.id === parseInt(jobId));
    setSelectedInternship(job);
    console.log(selectedInternship);
  };

  const handleCloseDetails = () => {
    setSelectedInternship(null);
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
      {showAddForm && (
        <AddForm
          onSave={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      <div className={showAddForm ? "internships-list blurred" : "internships-list"}>
        <div className='navbar2'>
          <h1>Internships</h1>
          <p className="username-display"><FontAwesomeIcon icon={faUser} /> {username}</p>
          {/* <button className="logout-button" onClick={handleLogout}>Logout</button> */}
          <button className="logout-button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
        {filteredInternships.map(internship => (
        <div className="mentoritem p-4 mb-4" key={internship.id}>
        {editingInternshipId === internship.id ? (
        <EditForm
        internship={internship}
        onSave={handleSave}
        onCancel={handleCancelEdit}
        />
        ) : (
        <>
        <p className="status">Status: {internship.Status}</p>
        <div className="details">
          <div className="job-title-container">
            <h2 className="job-title">{internship.Title}</h2>  
            <button className="job-details" onClick={() => handleShowDetails(internship.id)}><FontAwesomeIcon icon={faInfoCircle} /></button>
          </div>
          <p>Mentor: {internship.Mentor}</p>
          <p>Duration: {internship.Duration}</p>
          <p>Skills Required: {internship.Skills}</p>
          </div>
          <div className="buttons">
          <button className="button" onClick={() => handleEdit(internship.id)}>Edit</button>
          <button className="button" onClick={() => navigateToApplicationsPage(internship.id)}>View Applications</button>
          </div>
              </>
            )}
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
        ))}
      </div>
      <div className="add-internship-container">
        {!showAddForm && (
          <button className="add-internship-button" onClick={() => setShowAddForm(true)}>Add Internship</button>
        )}
      </div>
    </div>
  );
};

export default MentorPage;
