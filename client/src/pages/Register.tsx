import "../styles/Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useCreateEmployeeMutation} from "../api";
import type {CreateEmployeePayload} from "../api";

type Position = "RUNNER" | "WAITER" | "HEAD_WAITER";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [position, setPosition] = useState<Position>("WAITER");

    const [createEmployee, { isLoading, isSuccess, error }] = useCreateEmployeeMutation();

    const handleSubmit = () => {
        try{
            const payload: CreateEmployeePayload = {
                name: name,
                email: email,
                password: password,
                position: position,
            };
            createEmployee(payload);
        } catch(err) {
            console.log("Failed to register employee ", err)
        }
    };

    if (isLoading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error-message">Failed to register employee</p>;
    
    return (
        <div className="register">
            <h2>Register new employee</h2>
            {isSuccess ? (
                <>
                    <h4>Employee successfully registered</h4>
                    <button onClick={() => navigate("/employees")}>Back to list</button>
                </>
            ) : (
                <div className="register-form">
                    <form onSubmit={handleSubmit}>
                        <label>
                            Name
                            <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            />
                        </label>
                        <label>
                            Email
                            <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                        </label>
                        <label>
                            Password
                            <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            />
                        </label>
                        <label htmlFor="position">Position</label>
                        <select
                            id="position"
                            name="position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value as Position)}
                            required
                        >
                            <option value="WAITER">Waiter</option>
                            <option value="RUNNER">Runner</option>
                            <option value="HEAD_WAITER">Head waiter</option>
                        </select>

                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Register;