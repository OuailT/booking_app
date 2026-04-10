import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Register from "./pages/Register/Register";
import EmployeeList from "./pages/EmployeeList/EmployeeList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/employeelist" element={<EmployeeList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
