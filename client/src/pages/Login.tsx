import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

function Login() {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // store token + user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // role-based navigation
    if (data.user.role === "EMPLOYER") {
      navigate("/employeelist");
    } else {
      navigate("/"); // or other employee pages 
    }

  } catch (error) {
    console.error("Login error:", error);
  }
}
    return(
        <div className="login">
            <h2>Login</h2>
            <div className="login-form">
                <form>
                    <label>Name
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
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