import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const ExpenseForm = ({ expense, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState(expense ? Math.abs(expense.amount) : ''); // Store positive amount
  const [description, setDescription] = useState(expense ? expense.description : '');
  const [categoryId, setCategoryId] = useState(expense ? expense.categoryId : '');
  const [userId, setUserId] = useState(expense ? expense.userId : '');
  const [date, setDate] = useState(expense ? expense.date : '');
  const [transactionType, setTransactionType] = useState(expense ? (expense.amount >= 0 ? 'income' : 'expense') : 'expense'); // Default to expense
  const [error, setError] = useState('');

  const [categories, setCategories] = useState([]); // State to store categories
  const [users, setUsers] = useState([]); // State to store users

  // Fetch categories and users when the component mounts
  useEffect(() => {
    const fetchCategoriesAndUsers = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await api.get('/category/get/all');
        setCategories(categoriesResponse.data);

        // Fetch users
        const usersResponse = await api.get('/users/get/all');
        setUsers(usersResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchCategoriesAndUsers();
  }, []);

  // Pre-fill the form if editing an existing expense
  useEffect(() => {
    if (expense) {
      setAmount(Math.abs(expense.amount)); // Store positive amount
      setDescription(expense.description);
      setCategoryId(expense.categoryId);
      setUserId(expense.userId);
      setDate(expense.date);
      setTransactionType(expense.amount >= 0 ? 'income' : 'expense'); // Set transaction type based on amount
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate input fields
    if (!amount || !description || !categoryId || !userId || !date) {
      setError('All fields are required.');
      return;
    }
  
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }
  
    // Adjust the amount based on transaction type
    const adjustedAmount = transactionType === 'income' ? Math.abs(amount) : -Math.abs(amount);
  
    // Create the expense object
    const expenseData = {
      amount: adjustedAmount, // Use adjusted amount
      description,
      categoryId: parseInt(categoryId),
      userId: parseInt(userId),
      date,
    };
  
    try {
      let response;
      if (expense) {
        // Update an existing expense
        response = await api.put(`/expenses/update/${expense.id}`, expenseData);
        toast.success('Expense updated successfully');
      } else {
        // Create a new expense
        response = await api.post('/expenses/add', expenseData);
        toast.success('Expense added successfully');
      }
  
      // Call the onSubmit callback with the created/updated expense
      onSubmit(response.data);
  
      // Clear the form fields
      if (!expense) {
        setAmount('');
        setDescription('');
        setCategoryId('');
        setUserId('');
        setDate('');
        setTransactionType('expense'); 
      }
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to save expense. Please try again.');
      console.error('Error:', err);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">{expense ? 'Edit Transaction' : 'Add Transaction'}</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Add a dropdown for transaction type */}
          <div className="mb-3">
            <label htmlFor="transactionType" className="form-label">Transaction Type</label>
            <select
              id="transactionType"
              className="form-control"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

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
            <label htmlFor="description" className="form-label">Description</label>
            <input
              type="text"
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="categoryId" className="form-label">Category</label>
            <select
              id="categoryId"
              className="form-control"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="userId" className="form-label">User</label>
            <select
              id="userId"
              className="form-control"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              id="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary me-2">
            {expense ? 'Update' : 'Add'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;