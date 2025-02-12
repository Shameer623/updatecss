import React, { useState, useEffect } from "react";
import CategoryForm from "../components/Categories/CategoryForm";
import CategoryList from "../components/Categories/CategoryList";
import CategoryPieChart from "../components/Categories/CategoryPieChart";
import SideMenu from "../components/SideMenu";
import api from "../services/api";
import "../styles/Categories.css";
import { toast } from "react-toastify";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of categories per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await api.get("/category/get/all");
        const expensesResponse = await api.get("/expenses/get/all");
        setCategories(categoriesResponse.data);
        setExpenses(expensesResponse.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (category) => {
    if (editingCategory) {
      setCategories(
        categories.map((c) => (c.id === category.id ? category : c))
      );
      setEditingCategory(null);
    } else {
      setCategories([...categories, category]);
    }
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/category/delete/${id}`);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Category deleted successfully");
    } catch (err) {
      setError(err.message || "Failed to delete expense. Please try again.");
    }
  };

  // Paginate function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Prepare data for the expense pie chart
  const expensePieChartData = categories
    .map((category) => {
      const categoryExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expense.categoryName === category.name &&
          expense.amount < 0 &&
          expenseDate.getMonth() + 1 === new Date().getMonth() + 1 &&
          expenseDate.getFullYear() === new Date().getFullYear()
        );
      });

      const totalExpense = categoryExpenses.reduce(
        (sum, expense) => sum + Math.abs(expense.amount),
        0 //initial value of the accumulator sum
      );

      return {
        name: category.name,
        value: totalExpense,
      };
    })
    .filter((entry) => entry.value > 0);

  // Prepare data for the income pie chart
  const incomePieChartData = categories
    .map((category) => {
      const categoryIncomes = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expense.categoryName === category.name &&
          expense.amount >= 0 &&
          expenseDate.getMonth() + 1 === new Date().getMonth() + 1 &&
          expenseDate.getFullYear() === new Date().getFullYear()
        );
      });

      const totalIncome = categoryIncomes.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      return {
        name: category.name,
        value: totalIncome,
      };
    })
    .filter((entry) => entry.value > 0);

  return (
    <div className="text-css d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        <SideMenu />
        <div className="flex-grow-1 p-4">
          <h1>
            <i class="fa-solid fa-bars"></i> Category Corner
          </h1>
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
                  setEditingCategory(null);
                  setShowForm(!showForm);
                }}
              >
                {showForm ? "Hide Form" : "Add Category"}
              </button>
              {showForm && (
                <CategoryForm
                  category={editingCategory}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                  }}
                />
              )}
              <CategoryList
                categories={categories}
                onEdit={(category) => {
                  setEditingCategory(category);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                paginate={paginate}
              />

              {/* Display pie charts side by side */}
              <div className="row">
                <div className="col-md-6">
                  <CategoryPieChart data={expensePieChartData} type="expense" />
                </div>
                <div className="col-md-6">
                  <CategoryPieChart data={incomePieChartData} type="income" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
