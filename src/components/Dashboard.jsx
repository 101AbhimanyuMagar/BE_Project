import React, { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar'
import Content from './Content.jsx'

const Dashboard = () => {
    const [toggle, setToggle] = useState(true)
    const [selectedComponent, setSelectedComponent] = useState('')
    const Toggle = () =>{
        setToggle(!toggle)
    }
    return (
        <div className="container-fluid min-vh-100 " style={{ backgroundColor: '#545454' }}>
          {" "}
          <div className="row ">
            {" "}
            {toggle && (
              <div className="col-4 col-md-2 bg-white vh-100 position-fixed">
                {" "}
                <Sidebar setSelectedComponent={setSelectedComponent} />{" "}
              </div>
            )}{" "}
            {toggle && <div className="col-4 col-md-2"></div>}{" "}
            <div className="col">
              {" "}
              <Content selectedComponent={selectedComponent} Toggle={Toggle} />{" "}
            </div>{" "}
          </div>{" "}
        </div>
      );
      
}

export default Dashboard