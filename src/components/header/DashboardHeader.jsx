// src/DashboardHeader.js
import React from 'react';
import './DashboardHeader.css';

const DashboardHeader = () => {
  return (
    <div className="dashboard-header">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="search-container">
        <input type="text" placeholder="Search here..." className="search-input" />
        <button className="search-icon">&#128269;</button>
      </div>
      <div className="notification-icon">&#128276;</div>
    </div>
  );
};

export default DashboardHeader;
