import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BudgetForm = ({ budget, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState(budget ? budget.amount : '');
  const [categoryName, setCategoryName] = useState(budget ? budget.categoryName : '');
  const [startDate, setStartDate] = useState(budget ? budget.startDate : '');
  const [endDate, setEndDate] = useState(budget ? budget.endDate : '');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/category/get/all');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !categoryName || !startDate || !endDate) {
      setError('All fields are required.');
      return;
    }

    const selectedCategory = categories.find((cat) => cat.name === categoryName);
    if (!selectedCategory) {
      setError('Invalid category selected.');
      return;
    }

    const budgetData = {
      amount: parseFloat(amount),
      categoryId: selectedCategory.id,
      startDate,
      endDate,
    };

    try {
      let response;
      if (budget) {
        response = await api.put(`/budget/update/${budget.id}`, budgetData);
        toast.success('Budget updated successfully');
      } else {
        response = await api.post('/budget/set', budgetData);
        toast.success('Budget added successfully');
      }

      onSubmit(response.data);

      if (!budget) {
        setAmount('');
        setCategoryName('');
        setStartDate('');
        setEndDate('');
      }
      setError('');
    } catch (err) {
      setError(budget ? 'Failed to update budget. Please try again.' : 'Failed to create budget. Please try again.');
      console.error('Error:', err);
    }
  };

  return (
    <div className="card budget-form">
      <div className="card-body">
        <h5 className="card-title">{budget ? 'Edit Budget' : 'Add Budget'}</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input
              type="number"
              id="amount"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label">Category</label>
            <select
              id="categoryName"
              className="form-control"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              type="date"
              id="startDate"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              type="date"
              id="endDate"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary me-2">
            {budget ? 'Update' : 'Add'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;