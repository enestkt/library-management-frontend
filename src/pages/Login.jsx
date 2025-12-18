import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/userService";
import "../styles/auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
        }
    };

    return (
        <div className="auth-container">
            {/* Arka plan katmanı CSS ile yönetilecek */}
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">📚</div>
                    <h2>Kütüphane Yönetim Sistemi</h2>
                    <h1>Hoş Geldiniz!</h1>
                    <p>Lütfen panele erişmek için giriş yapın</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>E-posta Adresi</label>
                        <input
                            type="email"
                            placeholder="ornek@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Şifre</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn">
                        Giriş Yap
                    </button>
                </form>

                <div className="auth-footer">
                    Hesabınız yok mu? <Link to="/register">Hemen Kaydolun</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;