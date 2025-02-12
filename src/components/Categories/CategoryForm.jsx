import React, { useState } from 'react';
import axios from 'axios'; // Use axios directly
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryForm = ({ category, onSubmit, onCancel }) => {
  const [name, setName] = useState(category ? category.name : '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Category name is required.');
      return;
    }

    const categoryData = { name };

    try {
      const token = sessionStorage.getItem('token'); // Get the JWT token
      let response;

      if (category) {
        // Update existing category
        response = await axios.put(
          `http://localhost:8123/category/update/${category.id}`,
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT token
            },
          }
        );
        toast.success('Category updated successfully');
      } else {
        // Add new category
        response = await axios.post(
          'http://localhost:8123/category/add',
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT token
            },
          }
        );
        toast.success('Category added successfully');
      }

      onSubmit(response.data); // Call the onSubmit callback with the updated/added category

      if (!category) {
        setName(''); // Reset the form if adding a new category
      }
      setError('');
    } catch (err) {
      setError(
        category
          ? 'Failed to update category. Please try again.'
          : 'Failed to create category. Please try again.'
      );
      console.error('Error:', err);
      toast.error('Action failed !');
    }
  };

  return (
    <div className="card category-form">
      <div className="card-body">
        <h5 className="card-title">{category ? 'Edit Category' : 'Add Category'}</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Category Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary me-2">
            {category ? 'Update' : 'Add'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;