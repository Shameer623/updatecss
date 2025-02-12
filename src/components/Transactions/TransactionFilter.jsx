import React, { useState } from 'react';

const TransactionFilter = ({ onFilter, onClear }) => {
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const handleFilter = (e) => {
    e.preventDefault();

    // Convert the category filter input to lowercase for case-insensitive comparison
    const categoryFilter = category.toLowerCase();

    onFilter({ category: categoryFilter, startDate, endDate, transactionType });
    setIsFilterApplied(true);
  };

  const handleClear = () => {
    setCategory('');
    setStartDate('');
    setEndDate('');
    setTransactionType('');
    setIsFilterApplied(false);
    onClear();
  };

  return (
    <div className="card transaction-filter">
      <div className="card-body">
        <h5 className="card-title">Filter Transactions</h5>
        <form onSubmit={handleFilter}>
          <div className="row">
            <div className="col-md-3">
              <label htmlFor="category" className="form-label">Category</label>
              <input
                type="text"
                id="category"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="transactionType" className="form-label">Transaction Type</label>
              <select
                id="transactionType"
                className="form-control"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-primary me-2">
              Apply Filter
            </button>
            {isFilterApplied && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleClear}
              >
                Clear Filter
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFilter;