import "../styles/Register.css";
import { useState, useRef } from "react";
import type { Role } from "../types";

function Register() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loginCode, setLoginCode] = useState<string>("");
  const [role, setRole] = useState<Role>("waiter");
  const [photo, setPhoto] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  const choosePhoto = () => {
    photoInputRef.current?.click();
  };

  const handleSubmit = () => {
    // send data to backend
  };

  return (
    <div className="register">
      <h2>Register new employee</h2>
      <div className="login-form">
        <form>
          <label>
            First name
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          <label>
            Last name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
            Login code
            <input
              type="text"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
              required
            />
          </label>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            required
          >
            <option value="waiter">Waiter</option>
            <option value="runner">Runner</option>
            <option value="head-waiter">Head waiter</option>
          </select>
          <label htmlFor="photo">Upload photo</label>
          <div className="employee-photo" onClick={choosePhoto}>
            {photo && <img src={URL.createObjectURL(photo)} alt="preview" />}
          </div>
          <input
            style={{ visibility: "hidden" }}
            type="file"
            onChange={handlePhotoChange}
            ref={photoInputRef}
          />

          <button onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
