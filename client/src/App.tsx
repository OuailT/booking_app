import { useState } from 'react'
import './App.css';
import {useGetEmployeesQuery} from "./api"; 

function App() {
  const { data: employees, isLoading, error } = useGetEmployeesQuery();
  // displayed all the employees from the database into the console browser.
  console.log(employees);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employeelist" element={<EmployeeList />} />
        <Route path="/shiftrequest" element={<ShiftRequest />} />
        <Route path="/approvedschedule" element={<ApprovedSchedule />} />
        <Route path="/myavailability" element={<MyAvailability />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
