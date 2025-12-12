// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest } from "../api/api";
import "../styles/auth.css";

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await registerRequest(name, email, password);
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError("Kayıt başarısız. Bilgileri kontrol edin.");
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleRegister}>
                <h2>Create Account</h2>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-field">
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="auth-field">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="auth-field">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button className="auth-btn" type="submit">
                    Register
                </button>

                <p className="auth-link">
                    Hesabın var mı? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
