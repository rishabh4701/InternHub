import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './Mentor.css';
import logo from './images/Mnit_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const MentorPage = (props) => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [editingInternshipId, setEditingInternshipId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { userId, username, i_id } = useParams(); // Destructure params from useParams hook
  const history = useHistory();
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


  const handleEdit = (internshipId) => {
    setEditingInternshipId(internshipId);
  };

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
    const [updatedInternship, setUpdatedInternship] = useState(internship);

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
        <input
          type="text"
          name="Status"
          value={updatedInternship.Status}
          onChange={handleChange}
        />
        <div className="form-buttons">
          <button type="submit" className="save-button">Save</button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    );
  };

  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    // localStorage.removeItem('authToken'); // Example if using localStorage for auth token

    // Redirect to Home page
    history.push('');
  };

  const navigateToApplicationsPage = (id) => {
    history.push(`/applications/${id}`);
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
      user_id: userId, // Assuming new internships will have the same user_id
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
        <input
          type="text"
          name="Status"
          value={newInternship.Status}
          onChange={handleChange}
        />
        <div className="form-buttons">
          <button type="submit" className="save-button">Add Internship</button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    );
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
          <h2>{internship.Title}</h2>
          <p>Mentor: {internship.Mentor}</p>
          <p>Duration: {internship.Duration}</p>
        </div>
        <div className="buttons">
          <button className="button" onClick={() => handleEdit(internship.id)}>Edit</button>
          <button className="button" onClick={() => navigateToApplicationsPage(internship.id)}>View Applications</button>
        </div>
              </>
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
