import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BudgetList = ({ budgets, onEdit, onDelete }) => {
  const [categories, setCategories] = useState([]); // State to store categories
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const itemsPerPage = 5; // Number of items per page

  // Fetch categories from the backend when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/category/get/all"); // Fetch all categories
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Function to get category name by categoryId
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "N/A"; // Return category name or 'N/A' if not found
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budget/delete/${id}`); // Send a DELETE request
      onDelete(id); // Call the onDelete callback to update the UI
      toast.success("Budget deleted successfully !");
    } catch (err) {
      console.error("Error deleting budget:", err);
    }
  };

  // Calculate the current budgets to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBudgets = budgets.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="table-responsive budget-list">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBudgets.map((budget) => (
              <tr key={budget.id}>
                <td>{getCategoryName(budget.categoryId)}</td>{" "}
                {/* Use getCategoryName */}
                <td>₹{budget.amount}</td>
                <td>{budget.startDate}</td>
                <td>{budget.endDate}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => onEdit(budget)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(budget.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {Array.from(
            { length: Math.ceil(budgets.length / itemsPerPage) },
            (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button onClick={() => paginate(i + 1)} className="page-link">
                  {i + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default BudgetList;
