import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Users from './Users';
import './Application_status.css';
import logo from './images/Mnit_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faUserAlt, faCalendarAlt, faEye, faEyeSlash, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


const AdminPage = () => {
    const { userId, username, token } = useParams();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddForm, setShowAddForm] = useState(false);
    const [filteredInternships, setFilteredInternships] = useState([]);
    const [editingInternshipId, setEditingInternshipId] = useState(null);
    const jobsPerPage = 5;
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');


    const handleLogout = () => {
        navigate('/internship_portal');
      };
    console.log(username);


    useEffect(() => {
        fetchInternships();
        // axios.get('http://127.0.0.1:8000/internships/')
        //   .then(response => setJobs(response.data))
        //   .catch(error => console.error('There was an error fetching the jobs!', error));
      }, []);
    
      const fetchInternships = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/internships/');
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          } 
          const data = await response.json();
          const sortedData = data.sort((a, b) => (a.Status === 'Open' ? -1 : 1));
        setJobs(sortedData);
        setFilteredInternships(sortedData);
        } catch (error) {
          console.error('Error fetching internships:', error);
        }
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

      const navigateToUsers = () => {
        navigate(`/users/${token}`);
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
            <label>Skills:</label>
            <input
              type="text"
              name="Skills"
              value={updatedInternship.Skills}
              onChange={handleChange}
            />
            <div className="form-buttons">
              <button type="submit" className="save-button">Save</button>
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
      <nav className="navbar3">
        <div className="navbar-left">
          <Link className="home" to="/internship_portal">Home</Link>
          {/* <Link className="user" to="/user">User</Link> */}
          {/* <li className="users" onClick={navigateToUsers}>Users</li> */}
          
        </div>
        <div className="navbar-right">
          <span className="username"><FontAwesomeIcon icon={faUser} /> {username}</span>
          <button className="logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </button>
        </div>
      </nav>
      {showAddForm && (
        <AddForm
          onSave={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      <div className={showAddForm ? "internships-list blurred" : "internships-list"}>
        
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
          <p>Skills Required: {internship.Skills}</p>
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
  )
}

export default AdminPage