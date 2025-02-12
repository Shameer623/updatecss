import React, { useState, useEffect } from 'react';
import BudgetForm from '../components/Budgets/BudgetForm';
import BudgetList from '../components/Budgets/BudgetList';
import SideMenu from '../components/SideMenu';
import axios from 'axios';
import '../styles/Budget.css';

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Get the JWT token from sessionStorage
        const response = await axios.get('http://localhost:8123/budget/get/all', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the request headers
          },
        });
        setBudgets(response.data);
      } catch (err) {
        setError('Failed to fetch budgets. Please try again later.');
        console.error('Error fetching budgets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const handleSubmit = (budget) => {
    if (editingBudget) {
      setBudgets(budgets.map((b) => (b.id === budget.id ? budget : b)));
      setEditingBudget(null);
    } else {
      setBudgets([...budgets, budget]);
    }
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setBudgets(budgets.filter((b) => b.id !== id));
    
  };

  return (
    <div className="text-css d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        <SideMenu />
        <div className="flex-grow-1 p-4">
          <h1>Budget Compass <i className="fa-regular fa-compass"></i></h1>
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
                  setEditingBudget(null);
                  setShowForm(!showForm);
                }}
              >
                {showForm ? 'Hide Form' : 'Add Budget'}
              </button>
              {showForm && (
                <BudgetForm
                  budget={editingBudget}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingBudget(null);
                  }}
                />
              )}
              <BudgetList
                budgets={budgets}
                onEdit={(budget) => {
                  setEditingBudget(budget);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetsPage;