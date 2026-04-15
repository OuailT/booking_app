import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

type Role = "EMPLOYEE" | "EMPLOYER";

interface NavbarProps {
  role: Role;
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {role === "EMPLOYER" && (
          <>
            <li><a href="/employees">Employee list</a></li>
            <li><a href="/register">Register employee</a></li>
            <li><a href="/shiftrequest">Shift requests</a></li>

          </>
        )}

        {role === "EMPLOYEE" && (
          <li><a href="/availability">My Availability</a></li>
          //<li><a href="/myapprovedschedule">My Approved Schedule</a></li>
        )}

        {/* Shared */}
        {/*<li><a href="/approvedschedule">Approved Schedule</a></li>*/}
        <li><button onClick={handleLogout} className="logout-button">Log out</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;