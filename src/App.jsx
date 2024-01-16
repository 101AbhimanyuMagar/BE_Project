import React from 'react'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import DashboardContent  from "./components/Contents/DashboardContent.jsx"
import RoomsContent   from "./components/Contents/RoomsContent.jsx"
import  Courses  from "./components/Contents/Courses.jsx"
import  Professors  from "./components/Contents/Professors.jsx"
import  Years  from "./components/Contents/Years.jsx"
import  Periods  from "./components/Contents/Periods.jsx"

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          {/* <Routes>
        <Route path="/" element={<DashboardContent/>}></Route>
        <Route path="/" element={<RoomsContent/>}></Route>
        <Route path="/" element={<Courses/>}></Route>
        <Route path="/" element={<Professors/>}></Route>
        <Route path="/" element={<Years/>}></Route>
        <Route path="/" element={<Periods/>}></Route>
      </Routes> */}
        </Routes>
      </Router>
    </div>
  )
}

export default App