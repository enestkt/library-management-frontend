import { useState } from "react";
import { loginRequest } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginRequest(email, password);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/dashboard");
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Giriş başarısız!";
            alert("⚠️ Hata: " + errorMsg);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
        outline: "none",
        transition: "0.2s"
    };

    const buttonStyle = {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#3b82f6",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "0.3s"
    };

    return (
        <div className="auth-container" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)"
        }}>
            <div className="auth-card" style={{
                width: "100%",
                maxWidth: "400px",
                padding: "40px",
                borderRadius: "16px",
                backgroundColor: "white",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <h1 style={{ fontSize: "28px", color: "#1e293b", margin: "0 0 10px 0" }}>Hoş Geldiniz</h1>
                    <p style={{ color: "#64748b", fontSize: "14px" }}>Lütfen yönetim paneline erişmek için giriş yapın</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "5px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>E-posta Adresi</label>
                    </div>
                    <input
                        type="email"
                        style={inputStyle}
                        placeholder="ornek@mail.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                        onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                    />

                    <div style={{ marginBottom: "5px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Şifre</label>
                    </div>
                    <input
                        type="password"
                        style={inputStyle}
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                        onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                    />

                    <button
                        type="submit"
                        style={buttonStyle}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
                    >
                        Giriş Yap
                    </button>
                </form>

                <div style={{ marginTop: "25px", textAlign: "center", fontSize: "14px", color: "#64748b" }}>
                    Hesabınız yok mu?{" "}
                    <Link to="/register" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "600" }}>
                        Hemen Kaydolun
                    </Link>
                </div>
            </div>
        </div>
    );
}
