import React, { useState, useEffect } from 'react';

const MentorPage = (props) => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [editingInternshipId, setEditingInternshipId] = useState(null);
  const userId = props.match.params.userId;
  console.log(userId);
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
      const response = await fetch(`http://127.0.0.1:8000/internships/${updatedInternship.id}/    `, {
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
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    );
  };
  
  return (
    <div>
      <h1>Internships</h1>
        {filteredInternships.map(internship => (
          <div className="job-item p-4 mb-4" key={internship.id}>
            {editingInternshipId === internship.id ? (
              <EditForm
                internship={internship}
                onSave={handleSave}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                <h2>{internship.Title}</h2>
                <p>Mentor: {internship.Mentor}</p>
                <p>Duration: {internship.Duration}</p>
                <p>Status: {internship.Status}</p>
                <button onClick={() => handleEdit(internship.id)}>Edit</button>
              </>
            )}
          </div>
        ))}
    </div>
  );
};

export default MentorPage;
