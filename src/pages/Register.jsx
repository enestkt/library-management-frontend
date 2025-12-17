import { useState } from "react";
import { registerRequest } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerRequest(name, email, password);
            alert("✅ Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
            navigate("/login");
        } catch (err) {
            alert("❌ Kayıt hatası: Bu e-posta zaten kullanımda olabilir.");
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
        outline: "none"
    };

    const buttonStyle = {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#10b981",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer"
    };

    return (
        <div className="auth-container" style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            height: "100vh", background: "#f8fafc"
        }}>
            <div className="auth-card" style={{
                width: "100%", maxWidth: "450px", padding: "40px",
                borderRadius: "16px", backgroundColor: "white", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <h1 style={{ fontSize: "28px", color: "#1e293b" }}>Yeni Hesap Oluştur</h1>
                    <p style={{ color: "#64748b" }}>Kütüphane topluluğumuza katılın</p>
                </div>

                <form onSubmit={handleRegister}>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", fontWeight: "600" }}>Ad Soyad</label>
                    <input style={inputStyle} placeholder="Enes Tokat" required value={name} onChange={e => setName(e.target.value)} />

                    <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", fontWeight: "600" }}>E-posta</label>
                    <input style={inputStyle} type="email" placeholder="ornek@mail.com" required value={email} onChange={e => setEmail(e.target.value)} />

                    <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", fontWeight: "600" }}>Şifre</label>
                    <input style={inputStyle} type="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />

                    <button type="submit" style={buttonStyle}>Kaydı Tamamla</button>
                </form>

                <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
                    Zaten üye misiniz? <Link to="/login" style={{ color: "#10b981", fontWeight: "600" }}>Giriş Yapın</Link>
                </div>
            </div>
        </div>
    );
}
