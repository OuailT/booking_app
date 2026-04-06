import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeList from "./pages/EmployeeList";
import ShiftRequest from "./pages/ShiftRequest";
import ApprovedSchedule from "./pages/ApprovedSchedule";
import Availability from "./pages/MyAvailability";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/emloyeelist" element={<EmployeeList />} />
        <Route path="/jobschedule" element={<ShiftRequest />} />
        <Route path="/workschedule" element={<ApprovedSchedule />} />
        <Route path="/availability" element={<Availability />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
