import './App.css';
//import {useGetEmployeesQuery} from "./api";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeList from "./pages/EmployeeList";
import RequireRole from "./components/RequireRole";
import ApprovedSchedule from './pages/ApprovedSchedule';
import MyAvailability from './pages/MyAvailability';
import Register from './pages/Register';
import ShiftRequest from './pages/ShiftRequest';


function App() { // This belongs to EmployeeList.tsx, not here. ???
  //const { data: employees, isLoading, error } = useGetEmployeesQuery();
  // displayed all the employees from the database into the console browser.
  //console.log(employees);   
return (
<BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* EMPLOYER-only protected routes */}
        <Route
          element={
            <RequireRole roles={["EMPLOYER"]}/>
          }
        >
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* EMPLOYEE-only protected routes */}
        <Route
          element={
            <RequireRole roles={["EMPLOYEE"]}/>
          }
        >
          <Route path="/availability" element={<MyAvailability />} />
        </Route>

          {/* Shared routes */}
        <Route
          element={<RequireRole roles={["EMPLOYER", "EMPLOYEE"]} />}
        >
          <Route path="/schedule" element={<ApprovedSchedule />} />
          <Route path="/shiftrequest" element={<ShiftRequest />} />
        </Route>


        {/* Default fallback */}
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
