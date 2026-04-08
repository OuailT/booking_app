import { useNavigate } from "react-router-dom";
import "../styles/EmployeeList.css"

function EmployeeList() {
    const navigate = useNavigate();
    const list: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    return(
        <div className="employee-list">
            <div className="employee-list-top-bar">
                <h2>List of all employees</h2>
                <button onClick={() => navigate("/register")}>Register new employee</button>
            </div>
            <div className="employee-list-grid">
                {list.map((l) => (
                    <div className="employee-card">
                        <div className="employee-header"></div>
                        <div className="employee-body">
                            <div className="employee-avatar"></div>
                        </div>
                        <div className="employee-name">Name {l}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EmployeeList;