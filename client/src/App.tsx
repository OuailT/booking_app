import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeList from "./pages/EmployeeList";
import ShiftRequest from "./pages/ShiftRequest";
import ApprovedSchedule from "./pages/ApprovedSchedule";
import MyAvailability from "./pages/MyAvailability";
import "./App.css";

function App() {
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
