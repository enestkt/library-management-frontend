import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../api/api";
import "../styles/auth.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await loginRequest(email, password);

            // ⭐ KRİTİK NOKTA: Token, User ID ve Role bilgilerini saklıyoruz
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            localStorage.setItem("role", res.data.role); // "ADMIN" veya "USER"

            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* LOGO ALANI */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div style={{
                        width: "64px", height: "64px", background: "#eff6ff", borderRadius: "16px",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        fontSize: "32px", boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.2)"
                    }}>
                        📚
                    </div>
                </div>

                {/* BAŞLIKLAR */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b", margin: "0 0 8px 0" }}>
                        Welcome Back!
                    </h2>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                        Enter your credentials to access your account.
                    </p>
                </div>

                {/* HATA MESAJI */}
                {error && (
                    <div className="auth-error" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="auth-field">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="auth-field">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <label style={{ margin: 0 }}>Password</label>
                            <span style={{ fontSize: "12px", color: "#3b82f6", cursor: "pointer", fontWeight: "500" }}>
                                Forgot password?
                            </span>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        className="auth-btn"
                        type="submit"
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="auth-link">
                    Don't have an account? <Link to="/register">Create Account</Link>
                </div>

                <div style={{ marginTop: "32px", textAlign: "center", fontSize: "12px", color: "#94a3b8" }}>
                    &copy; 2025 Library Management System
                </div>
            </div>
        </div>
    );
}

export default Login;