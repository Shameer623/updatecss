import React, { useEffect, useState } from "react";
import SideMenu from "../components/SideMenu";
import api from "../services/api";
import '../styles/Dashboard.css'
import CategoryPieChart from "../components/Categories/CategoryPieChart";

const DashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const username = sessionStorage.getItem("username");

  // State for selected month and year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); //getMonth returns month with 0-indexed
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch expenses when the component mounts
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get("/expenses/get/all");
        const sortedExpenses = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setExpenses(sortedExpenses);
      } catch (err) {
        setError("Failed to fetch expenses. Please try again later.");
        console.error("Error fetching expenses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Filter expenses for the selected month and year
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() + 1 === selectedMonth &&
      expenseDate.getFullYear() === selectedYear
    );
  });

  // Calculate total income, expenses, and balance for the selected month
  const totalIncome = filteredExpenses
    .filter((expense) => expense.amount >= 0)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalExpense = filteredExpenses
    .filter((expense) => expense.amount < 0)
    .reduce((sum, expense) => sum + Math.abs(expense.amount), 0);

  const balance = totalIncome - totalExpense;

  // Prepare data for the expense pie chart
  const expensePieChartData = filteredExpenses
    .filter((expense) => expense.amount < 0)
    .reduce((acc, expense) => { //accumulator to store the total amounts for each category.
      const categoryName = expense.categoryName || "Uncategorized";
      acc[categoryName] = (acc[categoryName] || 0) + Math.abs(expense.amount);
      return acc;
    }, {});

  const expensePieChartDataArray = Object.keys(expensePieChartData)
    .map((category) => ({
      name: category,
      value: expensePieChartData[category],
    }))
    .filter((entry) => entry.value > 0); // removes category with no expense

  // Prepare data for the income pie chart
  const incomePieChartData = filteredExpenses
    .filter((expense) => expense.amount >= 0)
    .reduce((acc, expense) => {
      const categoryName = expense.categoryName || "Uncategorized";
      acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
      return acc;
    }, {});

  const incomePieChartDataArray = Object.keys(incomePieChartData)
    .map((category) => ({
      name: category,
      value: incomePieChartData[category],
    }))
    .filter((entry) => entry.value > 0);

  return (
    <div className="text-css d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        <SideMenu />
        <div className="flex-grow-1 p-4">
          <h1>Dashboard</h1>
          <p>
            Welcome, <strong>{username}</strong>! Here, you can track your
            expenses, manage categories, and more.
          </p>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-white" />      
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              {/* Summary Section */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card summary-card">
                    <div className="card-body">
                      <h5 className="card-title">Total Income</h5>
                      <p className="card-text text-success">₹{totalIncome.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card summary-card">
                    <div className="card-body">
                      <h5 className="card-title">Total Expense</h5>
                      <p className="card-text text-danger">₹{totalExpense.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card summary-card">
                    <div className="card-body">
                      <h5 className="card-title">Balance</h5>
                      <p className="card-text" style={{ color: balance >= 0 ? "green" : "red" }}>
                        ₹{balance.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expense and Income Distribution */}
              <h3>Expense and Income Distribution</h3>
              <div className="row mb-4">
                <div className="col-md-6">
                  <CategoryPieChart data={expensePieChartDataArray} type="expense" />
                </div>
                <div className="col-md-6">
                  <CategoryPieChart data={incomePieChartDataArray} type="income" />
                </div>
              </div>

              {/* Recent Transactions */}
              <h3>Recent Transactions</h3>
              <div className="table-responsive">
                <table className="table table-striped recent-transactions">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.slice(0, 5).map((expense) => (
                      <tr key={expense.id}>
                        <td>{expense.date}</td>
                        <td>{expense.categoryName || "N/A"}</td>
                        <td>{expense.amount >= 0 ? "Income" : "Expense"}</td>
                        <td>₹{Math.abs(expense.amount).toFixed(2)}</td>
                        <td>{expense.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;