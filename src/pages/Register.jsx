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
            // Kayıt sonrası otomatik login yapıp token'ı kaydediyoruz
            if(res.data.token) {
                localStorage.setItem("token", res.data.token);
                navigate("/dashboard");
            } else {
                navigate("/login");
            }
        } catch (err) {
            setError("Kayıt işlemi başarısız. Lütfen bilgileri kontrol edin.");
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleRegister}>
                <h2>Create Account</h2>
                <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "24px", fontSize: "14px" }}>
                    Join library management system
                </p>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-field">
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="auth-field">
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="auth-field">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button className="auth-btn" type="submit">
                    Sign Up
                </button>

                <div className="auth-link">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </form>
        </div>
    );
}

export default Register;