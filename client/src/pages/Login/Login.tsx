import './Login.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useGetEmployeesQuery} from "../../api";
import type {Employee} from "../../api";
import Cookie from "universal-cookie";

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const [loginAsUser, setLoginAsUser] = useState<boolean>(true);
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetEmployeesQuery();

    console.log(data)
    
    const [errorMessage, setErrorMessage] = useState<string>("");

    const cookies = new Cookie();
    
    const navigateToMyAvailability = (id: string) => {
        navigate("/myavailability", {
            state: { id: id }
        });
    }
    const handleLogin = async () => {
        try {
            if (loginAsUser){
                const employees: Employee[] = data as Employee[];

                const user = employees.find(e => e.email === email);

                if (!user) {
                    console.log("User not found");
                    setErrorMessage("Invalid username or password");
                    return;
                }

                if (user.password === password) {
                    console.log("Login success");
                    if(rememberMe) {
                        // Create a cookie that expires after 7 days
                        cookies.set("booking_app_cookie", user.id, {
                            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        })
                    }
                    navigateToMyAvailability(user.id);
                } else {
                    console.log("Wrong password");
                    setErrorMessage("Invalid username or password");
                }
            } else {
                // Implement admin login logic

                // navigate("/employeelist")
            }
        } catch (error) {
            console.error(`An unexpected error occurred `, error);
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };
    useEffect(() => {
        const cookieResult = cookies.get("booking_app_cookie");

        if (cookieResult) {
            navigateToMyAvailability(cookieResult);
        }
    }, []);

    if (isLoading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error-message">Failed to load data</p>;
    
    return(
        <div className="login">
            <h2>Login</h2>
            <div className="login-form">
                <form>
                    {loginAsUser == true ? <h3>Login as a user</h3> : <h3>Login as an admin</h3>}
                    <br/>
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
                    <br/>
                    <br/>
                    {loginAsUser == true ? (
                        <a style={{ cursor: "pointer" }} onClick={() => setLoginAsUser(!loginAsUser)}>Login as an admin</a> ) : (
                        <a style={{ cursor: "pointer" }}  onClick={() => setLoginAsUser(!loginAsUser)}>Login as a user</a> )
                    }
                </form>
            </div>
        </div>
    )
}

export default Login;