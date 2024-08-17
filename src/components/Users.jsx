import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useParams();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/users/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, isActive) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/auth/users/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive }), // Toggle the status
        
      });
      console.log(isActive); 
      if (!response.ok) throw new Error('Failed to update status.');
      await fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Users</h1>
      {users.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Status</th>
              <th>User Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Displaying Mentors */}
            {users
              .filter(user => user.is_staff) // Filter mentors (is_staff === true)
              .sort((a, b) => a.id - b.id) // Sort mentors by id in ascending order
              .sort((a, b) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1))
              .map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.first_name ? user.first_name : 'N/A'}</td>
                  <td>{user.is_active ? 'Active' : 'Blocked'}</td>
                  <td>Mentor</td>
                  <td>
                    <button onClick={() => updateUserStatus(user.id, user.is_active)}>
                      {user.is_active ? 'false' : 'true'}
                    </button>
                  </td>
                </tr>
              ))}

            {/* Displaying Students */}
            {users
              .filter(user => !user.is_staff) // Filter students (is_staff === false)
              .sort((a, b) => a.id - b.id) // Sort students by id in ascending order
              .sort((a, b) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1))
              .map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.first_name}</td>
                  <td>{user.is_active ? 'Active' : 'Blocked'}</td>
                  <td>Student</td>
                  <td>
                    <button onClick={() => updateUserStatus(user.id, user.is_active)}>
                      {user.is_active ? 'false' : 'true'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserPage;
