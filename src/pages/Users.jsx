import { useEffect, useState } from "react";
import { getAllUsers } from "../api/userService";
import { registerRequest } from "../api/api";
import "../styles/pages.css";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    // Kullanıcı listesini getir
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsers();
            setUsers(res.data || []);
        } catch (err) {
            console.error("Kullanıcılar yüklenemedi", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Yeni kullanıcı ekleme (Admin Paneli üzerinden Register)
    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            // Backend'deki register endpoint'ini kullanıyoruz
            await registerRequest(newUser.name, newUser.email, newUser.newUserPassword || newUser.password);
            setMsg({ text: "✅ Yeni kullanıcı başarıyla kütüphaneye kaydedildi!", type: "success" });

            // Formu temizle ve kapat
            setNewUser({ name: "", email: "", password: "" });
            setShowAddForm(false);

            // Listeyi tazele
            fetchUsers();

            // 3 saniye sonra mesajı kaldır
            setTimeout(() => setMsg({ text: "", type: "" }), 3000);
        } catch (err) {
            setMsg({ text: "❌ Hata: Kullanıcı oluşturulamadı. E-posta zaten kullanımda olabilir.", type: "error" });
        }
    };

    return (
        <div className="page">
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                    <h1>Sistem Kullanıcıları</h1>
                    <p>Kütüphane üyelerini görüntüleyin ve yeni üye kaydı yapın.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={showAddForm ? "btn-dark" : "btn-primary"}
                    style={{ padding: "10px 20px", borderRadius: "8px", fontWeight: "600" }}
                >
                    {showAddForm ? "✖ Vazgeç" : "+ Yeni Üye Ekle"}
                </button>
            </div>

            {/* Bildirim Mesajı */}
            {msg.text && (
                <div style={{
                    padding: "15px", borderRadius: "10px", marginBottom: "20px",
                    backgroundColor: msg.type === "success" ? "#dcfce7" : "#fee2e2",
                    color: msg.type === "success" ? "#166534" : "#991b1b",
                    textAlign: "center", fontWeight: "600", border: "1px solid"
                }}>
                    {msg.text}
                </div>
            )}

            {/* --- YENİ KULLANICI EKLEME FORMU --- */}
            {showAddForm && (
                <div className="card" style={{ marginBottom: "30px", border: "2px solid #3b82f6", padding: "20px" }}>
                    <h3 style={{ marginBottom: "20px" }}>👤 Yeni Üye Tanımlama</h3>
                    <form onSubmit={handleAddUser} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                        <div className="form-group">
                            <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", fontWeight: "600" }}>Ad Soyad</label>
                            <input
                                className="form-input" required placeholder="Örn: Ahmet Yılmaz"
                                value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})}
                                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", fontWeight: "600" }}>E-posta Adresi</label>
                            <input
                                className="form-input" type="email" required placeholder="ornek@mail.com"
                                value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", fontWeight: "600" }}>Şifre</label>
                            <input
                                className="form-input" type="password" required placeholder="******"
                                value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}
                                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ gridColumn: "span 3", padding: "12px", marginTop: "10px", fontWeight: "bold" }}>
                            Üyeliği Onayla ve Kaydet
                        </button>
                    </form>
                </div>
            )}

            {/* --- KULLANICI LİSTESİ TABLOSU --- */}
            <div className="card" style={{ padding: "0" }}>
                <div className="table-wrap">
                    <table className="table" style={{ margin: "0" }}>
                        <thead>
                        <tr>
                            <th style={{ padding: "15px" }}>ID</th>
                            <th>Ad Soyad</th>
                            <th>E-posta</th>
                            <th>Rol</th>
                            <th>Durum</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: "center", padding: "30px" }}>Veriler yükleniyor...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: "center", padding: "30px" }}>Henüz kayıtlı kullanıcı bulunmuyor.</td></tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id}>
                                    <td style={{ padding: "15px", color: "#64748b", fontWeight: "bold" }}>#{u.id}</td>
                                    <td style={{ fontWeight: "600", color: "#1e293b" }}>{u.name}</td>
                                    <td style={{ color: "#64748b" }}>{u.email}</td>
                                    <td>
                                        <span className="badge ok" style={{ fontSize: "11px" }}>USER</span>
                                    </td>
                                    <td>
                                        <span style={{ color: "#10b981", fontSize: "12px", fontWeight: "600" }}>● Aktif</span>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}