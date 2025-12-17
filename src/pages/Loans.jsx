import { useEffect, useState } from "react";
import { borrowBook, returnBook, getUserLoans, getAllUsers, getAllBooks } from "../api/loanService";
import "../styles/pages.css";
import "../styles/loans.css";

export default function Loans() {
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedBook, setSelectedBook] = useState("");
    const [historyUserId, setHistoryUserId] = useState("");
    const [history, setHistory] = useState([]);
    const [msg, setMsg] = useState({ text: "", type: "" });

    const loadData = async () => {
        try {
            const u = await getAllUsers();
            const b = await getAllBooks();
            setUsers(u.data || []);
            setBooks(b.data || []);
        } catch (error) {
            console.error("Yükleme hatası:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleBorrow = async () => {
        try {
            await borrowBook(selectedBook, selectedUser);
            setMsg({ text: "✅ Kitap başarıyla ödünç verildi!", type: "success" });
            loadData();
            if (historyUserId) loadHistory();
        } catch {
            setMsg({ text: "❌ Hata: Kitap şu an ödünç verilemiyor.", type: "error" });
        }
    };

    const handleReturn = async (id) => {
        try {
            await returnBook(id);
            setMsg({ text: "✅ Kitap iade alındı!", type: "success" });
            loadData();
            if (historyUserId) loadHistory();
        } catch {
            setMsg({ text: "❌ İade işlemi başarısız oldu.", type: "error" });
        }
    };

    const loadHistory = async () => {
        if (!historyUserId) return;
        try {
            const res = await getUserLoans(historyUserId);
            setHistory(res.data || []);
        } catch {
            setHistory([]);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Ödünç Yönetim Merkezi</h1>
                <p>Kitap sirkülasyonunu ve kullanıcı geçmişini buradan kontrol edin.</p>
            </div>

            {/* Mesaj Bildirimi */}
            {msg.text && (
                <div style={{
                    padding: "15px", borderRadius: "12px", marginBottom: "25px",
                    backgroundColor: msg.type === "success" ? "#ecfdf5" : "#fef2f2",
                    color: msg.type === "success" ? "#065f46" : "#991b1b",
                    border: `1px solid ${msg.type === "success" ? "#10b981" : "#f87171"}`,
                    fontWeight: "600", textAlign: "center", animation: "slideIn 0.5s"
                }}>
                    {msg.text}
                </div>
            )}

            <div className="grid-layout" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>

                {/* --- BORROW SECTION --- */}
                <div className="card" style={{ borderLeft: "6px solid #3b82f6" }}>
                    <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>📖</span> Yeni Ödünç İşlemi
                    </h2>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-end" }}>
                        <div style={{ flex: 1, minWidth: "250px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Kullanıcı</label>
                            <select
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}
                            >
                                <option value="">Bir kullanıcı seçin...</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: "250px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Kitap</label>
                            <select
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}
                            >
                                <option value="">Bir kitap seçin...</option>
                                {books.map(b => (
                                    <option key={b.id} value={b.id} disabled={!b.available}>
                                        {b.title} {b.available ? " (Mevcut ✅)" : " (Ödünçte ❌)"}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleBorrow}
                            disabled={!selectedUser || !selectedBook}
                            className="btn-primary"
                            style={{ padding: "12px 30px", height: "48px" }}
                        >
                            Ödünç Ver
                        </button>
                    </div>
                </div>

                {/* --- HISTORY & RETURN SECTION --- */}
                <div className="card" style={{ borderLeft: "6px solid #f97316" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
                        <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>📜</span> Kullanıcı İşlem Geçmişi
                        </h2>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <select
                                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                value={historyUserId} onChange={(e) => setHistoryUserId(e.target.value)}
                            >
                                <option value="">Kullanıcıya göre filtrele...</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                            <button onClick={loadHistory} disabled={!historyUserId} className="btn-dark">Sorgula</button>
                        </div>
                    </div>

                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>İşlem ID</th>
                                <th>Kitap Başlığı</th>
                                <th>Durum</th>
                                <th>Ödünç Tarihi</th>
                                <th>İşlem</th>
                            </tr>
                            </thead>
                            <tbody>
                            {history.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Görüntülenecek kayıt bulunamadı.</td></tr>
                            ) : (
                                history.map((l) => (
                                    <tr key={l.id}>
                                        <td style={{ fontWeight: "bold" }}>#{l.id}</td>
                                        <td>{l.bookTitle}</td>
                                        <td>
                                                <span className={`badge ${l.status === "BORROWED" ? "warn" : "ok"}`}>
                                                    {l.status === "BORROWED" ? "Teslim Edilmedi" : "İade Edildi"}
                                                </span>
                                        </td>
                                        <td>{l.loanDate}</td>
                                        <td>
                                            {l.status === "BORROWED" && (
                                                <button
                                                    onClick={() => handleReturn(l.id)}
                                                    style={{
                                                        backgroundColor: "#f97316", color: "white", border: "none",
                                                        padding: "8px 15px", borderRadius: "6px", cursor: "pointer",
                                                        fontWeight: "bold", transition: "0.3s"
                                                    }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = "#ea580c"}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = "#f97316"}
                                                >
                                                    İade Al ↩️
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}