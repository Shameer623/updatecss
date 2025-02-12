import React, { useState, useEffect } from "react";
import SideMenu from "../components/SideMenu";
import api from "../services/api";
import "../styles/Transactions.css";
import ExpenseForm from "../components/Expenses/ExpenseForm";
import TransactionFilter from "../components/Transactions/TransactionFilter";

const TransactionsPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesResponse, categoriesResponse] = await Promise.all([
          api.get("/expenses/get/all"),
          api.get("/category/get/all"),
        ]);

        const sortedExpenses = expensesResponse.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setExpenses(sortedExpenses);
        setFilteredExpenses(sortedExpenses);
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError(
          err.message || "Failed to fetch data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (expense) => {
    let updatedExpenses;

    // Find the category name based on the categoryId
    const category = categories.find((cat) => cat.id === expense.categoryId);
    const categoryName = category ? category.name : "Uncategorized";

    // Add the categoryName to the expense object
    const expenseWithCategoryName = {
      ...expense,
      categoryName,
    };

    if (editingExpense) {
      // Update an existing expense
      updatedExpenses = expenses.map((e) =>
        e.id === expense.id ? expenseWithCategoryName : e
      );
    } else {
      // Add a new expense
      updatedExpenses = [...expenses, expenseWithCategoryName];
    }

    // Sort the expenses by date
    const sortedExpenses = updatedExpenses.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Update the state
    setExpenses(sortedExpenses);
    setFilteredExpenses(sortedExpenses);
    setEditingExpense(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/delete/${id}`);
      const updatedExpenses = expenses.filter((e) => e.id !== id);
      const updatedFilteredExpenses = filteredExpenses.filter(
        (e) => e.id !== id
      );
      const sortedExpenses = updatedExpenses.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      const sortedFilteredExpenses = updatedFilteredExpenses.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setExpenses(sortedExpenses);
      setFilteredExpenses(sortedFilteredExpenses);
    } catch (err) {
      setError(err.message || "Failed to delete expense. Please try again.");
    }
  };

  const handleFilter = ({ category, startDate, endDate, transactionType }) => {
    const filtered = expenses.filter((expense) => {
      const matchesCategory = category
        ? expense.categoryName.toLowerCase().includes(category.toLowerCase()) // Case-insensitive comparison
        : true;
      const matchesStartDate = startDate ? expense.date >= startDate : true;
      const matchesEndDate = endDate ? expense.date <= endDate : true;
      const matchesTransactionType = transactionType
        ? transactionType === "income"
          ? expense.amount >= 0
          : expense.amount < 0
        : true;

      return (
        matchesCategory &&
        matchesStartDate &&
        matchesEndDate &&
        matchesTransactionType
      );
    });

    const sortedFilteredExpenses = filtered.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setFilteredExpenses(sortedFilteredExpenses);
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setFilteredExpenses(expenses);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="text-css d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        <SideMenu />
        <div className="flex-grow-1 p-4">
          <h1>
            Expense Explorer <i className="fa-brands fa-wpexplorer"></i>
          </h1>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-white" />
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : expenses.length === 0 ? (
            <div className="alert alert-info">No expenses found.</div>
          ) : (
            <>
              <button
                className="btn btn-primary mb-3"
                onClick={() => {
                  setEditingExpense(null);
                  setShowForm(!showForm);
                }}
              >
                {showForm ? "Hide Form" : "Add Transaction"}
              </button>
              {showForm && (
                <ExpenseForm
                  expense={editingExpense}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingExpense(null);
                  }}
                />
              )}

              <TransactionFilter
                onFilter={handleFilter}
                onClear={handleClearFilter}
              />

              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExpenses.map((expense) => (
                      <tr key={expense.id}>
                        <td>{expense.date}</td>
                        <td>{expense.categoryName}</td>
                        <td>{expense.amount >= 0 ? "Income" : "Expense"}</td>
                        <td>₹{Math.abs(expense.amount)}</td>
                        <td>{expense.description}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => {
                              setEditingExpense(expense);
                              setShowForm(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(expense.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <nav>
                <ul className="pagination">
                  {Array.from(
                    {
                      length: Math.ceil(filteredExpenses.length / itemsPerPage),
                    },
                    (_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${currentPage === i + 1 ? "active" : ""
                          }`}
                      >
                        <button
                          onClick={() => paginate(i + 1)}
                          className="page-link"
                        >
                          {i + 1}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
