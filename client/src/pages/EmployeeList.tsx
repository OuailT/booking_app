import { useNavigate } from "react-router-dom";
import '../styles/EmployeeList.css';
import {useGetEmployeesQuery} from "../api";
import type {Employee} from "../api";
import Navbar from "../components/Navbar";

function EmployeeList() {
    const navigate = useNavigate();
    
    const { data, isLoading, error } = useGetEmployeesQuery();
    const employees: Employee[] = data as Employee[];

    if (isLoading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error-message">Failed to load data</p>;
    
    return(
        <div className="employee-list">
            <Navbar role="EMPLOYER" />
            <div className="employee-list-top-bar">
                <h2>List of all employees</h2>
                <button onClick={() => navigate("/register")}>Register new employee</button>
            </div>
            <div className="employee-list-grid">
                {employees?.map((e, i) => (
                    <div className="employee-card" key={i}>
                        <div className="employee-header"></div>
                        <div className="employee-body">
                            <div className="employee-avatar"></div>
                        </div>
                        <div className="employee-name">{e.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EmployeeList;