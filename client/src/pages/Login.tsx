import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import '../styles/Login.css';
import Cookie from "universal-cookie";

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const navigate = useNavigate();

    const cookies = new Cookie();

    const handleLogin = async () => {
        try {
            // backend return jws token
            const response = await api.post('/login', { email, password });
            const token = response.data.token;
            if(rememberMe) {
                // create a cookie that expires after 7 days
                cookies.set("jwt_authorization", token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })
            }
            // Navigate to page if status is ok: navigate("/page")
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