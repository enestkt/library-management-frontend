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
            setMsg({ text: "❌ Hata oluştu! Kitap müsait olmayabilir.", type: "error" });
        }
    };

    const handleReturn = async (loanId) => {
        // ID kontrolü: Eğer ID gelmezse işlemi başlatma
        if (!loanId) {
            setMsg({ text: "❌ Hata: İşlem ID'si bulunamadı.", type: "error" });
            return;
        }

        try {
            await returnBook(loanId);
            setMsg({ text: "✅ Kitap başarıyla iade alındı!", type: "success" });
            loadData(); // Kitap listesini ve müsaitlik durumunu güncelle
            if (historyUserId) loadHistory(); // Tabloyu güncelle
        } catch (error) {
            setMsg({ text: "❌ İade işlemi başarısız.", type: "error" });
        }
    };

    const loadHistory = async () => {
        if (!historyUserId) return;
        try {
            const res = await getUserLoans(historyUserId);
            setHistory(res.data || []); // Kullanıcının ödünç geçmişini getir
        } catch {
            setHistory([]);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Ödünç & İade Merkezi</h1>
                <p>Kitap ödünç verme ve iade süreçlerini yönetin.</p>
            </div>

            {msg.text && (
                <div style={{
                    marginBottom: "20px", padding: "14px", borderRadius: "10px",
                    background: msg.type === "success" ? "#dcfce7" : "#fee2e2",
                    color: msg.type === "success" ? "#166534" : "#991b1b",
                    fontWeight: "600", textAlign: "center", border: "1px solid"
                }}>
                    {msg.text}
                </div>
            )}

            <div className="grid-layout" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* --- ÖDÜNÇ VERME KARTI --- */}
                <div className="card" style={{ borderTop: "4px solid #3b82f6" }}>
                    <h3 style={{ marginTop: 0 }}>📖 Yeni Ödünç İşlemi</h3>
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "flex-end" }}>
                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "5px" }}>Kullanıcı Seç</label>
                            <select
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}
                            >
                                <option value="">-- Kullanıcı --</option>
                                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "5px" }}>Kitap Seç</label>
                            <select
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                                value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}
                            >
                                <option value="">-- Kitap --</option>
                                {books.map((b) => (
                                    <option key={b.id} value={b.id} disabled={!b.available}>
                                        {b.title} {b.available ? "✅" : "(Ödünçte ❌)"}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleBorrow} disabled={!selectedUser || !selectedBook} className="btn-primary" style={{ padding: "10px 25px", height: "42px" }}>
                            Ödünç Ver
                        </button>
                    </div>
                </div>

                {/* --- İŞLEM GEÇMİŞİ & ARKA PLANDA ID İLE İADE --- */}
                <div className="card" style={{ borderTop: "4px solid #f97316" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h3 style={{ margin: 0 }}>📜 İşlem Geçmişi & İade Paneli</h3>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <select
                                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                                value={historyUserId}
                                onChange={(e) => setHistoryUserId(e.target.value)}
                            >
                                <option value="">Kullanıcı Filtrele</option>
                                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                            <button onClick={loadHistory} disabled={!historyUserId} className="btn-dark" style={{ padding: "8px 16px" }}>Listele</button>
                        </div>
                    </div>

                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>İşlem No</th>
                                <th>Kitap</th>
                                <th>Durum</th>
                                <th>Tarih</th>
                                <th>İşlem</th>
                            </tr>
                            </thead>
                            <tbody>
                            {history.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>Kayıtları görmek için kullanıcı seçip listeleyin.</td></tr>
                            ) : (
                                history.map((l) => {
                                    // ID'yi burada arka planda yakalıyoruz
                                    const currentLoanId = l.loanId || l.id;
                                    return (
                                        <tr key={currentLoanId}>
                                            <td style={{ fontWeight: "600", color: "#64748b" }}>#{currentLoanId}</td>
                                            <td>{l.bookTitle || l.book?.title}</td>
                                            <td>
                                                    <span className={`badge ${l.status === "BORROWED" ? "warn" : "ok"}`}>
                                                        {l.status === "BORROWED" ? "Ödünçte" : "İade Edildi"}
                                                    </span>
                                            </td>
                                            <td>{l.loanDate}</td>
                                            <td>
                                                {/* ID arka planda handleReturn'e gönderiliyor */}
                                                {l.status === "BORROWED" && (
                                                    <button
                                                        onClick={() => handleReturn(currentLoanId)}
                                                        style={{ backgroundColor: "#f97316", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                                                    >
                                                        İade Al ↩️
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}