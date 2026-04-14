import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import EmployeeList from "./pages/EmployeeList/EmployeeList";
import Availabilities from "./pages/Availabilities/Availabilities";
import MyAvailability from "./pages/MyAvailability/MyAvailability";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employeelist" element={<EmployeeList />} />
        <Route path="/availabilities" element={<Availabilities />} />
        <Route path="/myavailability" element={<MyAvailability />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
