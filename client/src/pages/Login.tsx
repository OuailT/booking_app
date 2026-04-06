import { useState } from "react";
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const handleLogin = () => {
        console.log("email ", email);
        console.log("password ", password);
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
                    <button onClick={handleLogin}>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;