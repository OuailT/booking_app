import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
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
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employeelist" element={<EmployeeList />} />
          <Route path="/jobschedule" element={<ShiftRequest />} />
          <Route path="/workschedule" element={<ApprovedSchedule />} />
          <Route path="/availability" element={<Availability />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
