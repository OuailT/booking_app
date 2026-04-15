import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleLogin = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password }),
        });

        const data = await res.json();
        
        if (!res.ok) {
          setErrorMessage("Login failed");
          throw new Error(data.message || "Login failed");
        }

        // store token + user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // role-based navigation
        if (data.user.role === "EMPLOYER") {
          navigate("/employees");
        } else if (data.user.role === "EMPLOYEE") {
          navigate("/availability", {
            state: { id: data.user.id, employeename: data.user.name  }
        });
        }

      } catch (error) {
        setErrorMessage("Invalid username or password");
        console.error("Login error:", error);
      }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };
    return(
        <div className="login">
            <h2>Login</h2>
            <div className="login-form">
                <form>
                    <label>Email
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
                    </label>
                    <label>Password
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
                    </label>
                    <label>Remember me
                        <input type="checkbox" onChange={() => setRememberMe(!rememberMe)} />
                    </label>
                    <div className="login-error-message">{errorMessage}</div>
                    <button type="button" onClick={handleLogin}>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;