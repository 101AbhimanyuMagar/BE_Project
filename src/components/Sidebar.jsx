import React from "react";

import "./style.css";

function Sidebar({ setSelectedComponent }) {
  return (
    <div className="bg-white sidebar p-2">
      {" "}
      <div className="m-2">
        {" "}
        <i className="bi bi-bank2 me-3 fs-4"></i>{" "}
        <span className="brand-name fs-4">Admin</span>{" "}
      </div>{" "}
      <hr className="text-dark" />{" "}
      {/* ... */}
      <div className="list-group list-group-flush">
        <a
          className=" list-group-item py-2"
          onClick={() => setSelectedComponent('Dashboard')}
        >
        <i className="bi bi-speedometer2 fs-5 me-3"></i>{" "}
          <span>Dashboard</span>{" "}
        </a>{" "}
        <a
          className="list-group-item py-2"
          onClick={() => setSelectedComponent('Rooms')}
        >
         <i className="bi bi-house fs-5 me-3"></i>{" "}
          <span>Rooms</span>{" "}
        </a>{" "}
        <a
          className="list-group-item py-2"
          onClick={() => setSelectedComponent('Courses')}
        >
         <i className="bi bi-book fs-5 me-3"></i>{" "}
          <span>Courses</span>{" "}
        </a>{" "}
        <a
          className="list-group-item py-2"
          onClick={() => setSelectedComponent('Professors')}
        >
         <i className="bi bi-person fs-5 me-3"></i>{" "}
          <span>Professors</span>{" "}
        </a>{" "}
        <a
          className="list-group-item py-2"
          onClick={() => setSelectedComponent('Years')}
        >
         <i className="bi bi-calendar fs-5 me-3"></i>{" "}
          <span>Years</span>{" "}
        </a>{" "}
        <a
          className="list-group-item py-2"
          onClick={() => setSelectedComponent('Periods')}
        >
         <i className="bi bi-clock-history fs-5 me-3"></i>{" "}
          <span>Lectures</span>{" "}
        </a>{" "}
        <a
          className="list-group-item py-2"
          onClick={() => setSelectedComponent('Logout')}
        >
         <i className="bi bi-power fs-5 me-3"></i>{" "}
          <span>Logout</span>{" "}
        </a>{" "}
      </div>
    </div>
  );
}

export default Sidebar;
