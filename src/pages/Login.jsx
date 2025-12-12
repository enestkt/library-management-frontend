// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../api/api";
import "../styles/auth.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await loginRequest(email, password);
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError("Email veya şifre hatalı");
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleLogin}>
                <h2>Library Login</h2>

                {error && <div className="auth-error">{error}</div>}

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
                    Login
                </button>

                <p className="auth-link">
                    Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
