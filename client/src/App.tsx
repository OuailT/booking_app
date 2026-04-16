import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeList from "./pages/EmployeeList";
import RequireRole from "./components/RequireRole";
import MyAvailability from './pages/MyAvailability';
import Register from './pages/Register';
import ShiftRequest from './pages/ShiftRequest';
import ApprovedSchedule from './pages/ApprovedSchedule';
import MyApprovedSchedule from './pages/MyApprovedSchedule';


function App() {
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
          <Route path="/shiftrequest" element={<ShiftRequest />} />
          <Route path="/approvedschedule" element={<ApprovedSchedule />} />
        </Route>

        {/* EMPLOYEE-only protected routes */}
        <Route
          element={
            <RequireRole roles={["EMPLOYEE"]}/>
          }
        >
          <Route path="/availability" element={<MyAvailability />} />
          {/* TBD */}
          <Route path="/myapprovedschedule" element={<MyApprovedSchedule />} />
        </Route>

          {/* Shared routes */}
        <Route
          element={<RequireRole roles={["EMPLOYER", "EMPLOYEE"]} />}
        >
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