import React from "react";

import Navbar from "./Navbar.jsx";

import "./style.css";
import DashboardContent from "./Contents/DashboardContent.jsx";
import RoomsContent from "./Contents/RoomsContent.jsx";
import Courses from "./Contents/Courses.jsx";
import Years from "./Contents/Years.jsx";
import Professors from "./Contents/Professors.jsx";
import Periods from "./Contents/Periods.jsx";
import Logout from "./Contents/Logout.jsx";



function Content({ selectedComponent, Toggle }) {
  return (
   
    <div className="px-3">
      {" "}
      <Navbar Toggle={Toggle} />{" "}
      {/* {console.log(selectedComponent)} */}
      {selectedComponent === 'Dashboard' && <DashboardContent/>}
      {selectedComponent === 'Rooms' && <RoomsContent/>}
      {selectedComponent === 'Courses' && <Courses/>}
      {selectedComponent === 'Years' && <Years/>}
      {selectedComponent === 'Professors' && <Professors/>}
      {selectedComponent === 'Periods' && <Periods/>}
      {selectedComponent === 'Logout' && <Logout/>}
    </div>
   
  );
}
export default Content;
