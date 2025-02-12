import React from 'react';
import axios from 'axios'; // Use axios directly
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserList = ({ users, onEdit, onDelete }) => {
  const handleDelete = async (id) => {
    const token = sessionStorage.getItem('token'); // Get the JWT token

    try {
      await axios.delete(`http://localhost:8123/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
      });
      toast.success('User deleted successfully');
      onDelete(id); // Call the onDelete callback to update the UI
    } catch (err) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="table-responsive user-list">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;