import React, { useState, useEffect } from 'react';
import UserForm from '../components/Users/UserForm';
import UserList from '../components/Users/UserList';
import SideMenu from '../components/SideMenu';
import api from '../services/api';
import '../styles/Users.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users/get/all');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        toast.error('Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (user) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
      setEditingUser(null);
    } else {
      setUsers([...users, user]);
    }
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  return (
    <div className="text-css d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        <SideMenu />
        <div className="flex-grow-1 p-4">
          <h1>Basecamp <i class="fa-solid fa-person-military-rifle"></i></h1>
          <p>
            Welcome to Basecamp, <strong>{username}</strong>!
          </p>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-white" />
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <button
                className="btn btn-primary mb-3"
                onClick={() => {
                  setEditingUser(null);
                  setShowForm(!showForm);
                }}
              >
                {showForm ? 'Hide Form' : 'Add User'}
              </button>
              {showForm && (
                <UserForm
                  user={editingUser}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingUser(null);
                  }}
                />
              )}
              <UserList
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UsersPage;