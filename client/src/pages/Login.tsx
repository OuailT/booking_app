import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await api.post('/login', { email, password });
        /*if (user.role === "EMPLOYER") {
            show admin pages : Approved Schedule, Employee List, Register Employee, ShiftRequest
            In every page return {user.role === "EMPLOYER" ? <EmployeeList /> : <EmployeeList />}
        } else {
             show employee pages : MyAvailability,ShiftRequest, Approved Schedule
}*/
        } catch (error) {
            console.error(`An unexpected error occurred `, error);
        }
    }
    return(
        <div className="login">
            <h2>Login</h2>
            <div className="login-form">
                <form>
                    <label>Email
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label>Password
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <label>Remember me
                        <input type="checkbox" onChange={() => setRememberMe(!rememberMe)} />
                    </label>
                    <button type="button" onClick={handleLogin}>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;