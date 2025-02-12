import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink instead of Link
import '../styles/SideMenu.css';

const SideMenu = () => {
  const role = sessionStorage.getItem('role'); // Get the user's role from sessionStorage

  return (
    <div className="side-menu bg-light border-end" style={{ width: '250px', height: '420px' }}>
      <div className="p-3">
        <h4 className="mb-4">Menu</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to="/dashboard" className="nav-link" activeClassName="active">
              <i className="fas fa-home"></i> Financial Horizon
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/transactions" className="nav-link" activeClassName="active">
              <i className="fas fa-chart-line"></i> Expense Explorer
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/calendar" className="nav-link" activeClassName="active">
              <i className="fas fa-calendar-alt"></i> Money Map
            </NavLink>
          </li>
          {role === 'ADMIN' && (
            <>
              <li className="nav-item">
                <NavLink to="/categories" className="nav-link" activeClassName="active">
                  <i className="fas fa-tags"></i> Category Corner
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/budgets" className="nav-link" activeClassName="active">
                  <i className="fas fa-wallet"></i> Budget Compass
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/users" className="nav-link" activeClassName="active">
                  <i className="fas fa-users"></i> User Basecamp
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;