import { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeList from './pages/EmployeeList';
import JobSchedule from './pages/JobSchedule';
import WorkSchedule from './pages/WorkSchedule';
import Availability from './pages/Availability';
import './App.css';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/emloyeelist" element={<EmployeeList />} />
        <Route path="/jobschedule" element={<JobSchedule />} />
        <Route path="/workschedule" element={<WorkSchedule />} />
        <Route path="/availability" element={<Availability />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
