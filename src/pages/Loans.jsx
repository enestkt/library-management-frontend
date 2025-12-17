import { useEffect, useState } from "react";
import { borrowBook, returnBook, getUserLoans, getAllUsers, getAllBooks } from "../api/loanService";
import "../styles/pages.css";
import "../styles/loans.css";

export default function Loans() {
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedBook, setSelectedBook] = useState("");
    const [loanId, setLoanId] = useState(""); // Manuel giriş için hala duruyor
    const [historyUserId, setHistoryUserId] = useState("");
    const [history, setHistory] = useState([]);
    const [msg, setMsg] = useState({ text: "", type: "" });

    // Verileri yükle
    const loadData = async () => {
        try {
            const u = await getAllUsers();
            const b = await getAllBooks();
            setUsers(u.data || []);
            setBooks(b.data || []);
        } catch (error) {
            console.error("Veri yükleme hatası:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Kitap Ödünç Al
    const handleBorrow = async () => {
        try {
            await borrowBook(selectedBook, selectedUser);
            setMsg({ text: "✅ Kitap başarıyla ödünç verildi!", type: "success" });
            loadData(); // Listeyi tazele
            if(historyUserId === selectedUser) loadHistory(); // Eğer o kullanıcının geçmişine bakıyorsak orayı da tazele
        } catch {
            setMsg({ text: "❌ Hata oluştu! Kitap müsait olmayabilir.", type: "error" });
        }
    };

    // Kitap İade Et (Geliştirilmiş: ID parametresi alabilir)
    const handleReturn = async (idFromTable) => {
        const targetId = idFromTable || loanId;
        if (!targetId) return;

        try {
            await returnBook(targetId);
            setMsg({ text: "✅ Kitap başarıyla iade alındı!", type: "success" });
            setLoanId(""); // Inputu temizle
            loadData(); // Kitap müsaitliğini güncelle
            if (historyUserId) loadHistory(); // Tabloyu güncelle
        } catch {
            setMsg({ text: "❌ İade işlemi başarısız. ID hatalı olabilir.", type: "error" });
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
                <h1>Kütüphane İşlemleri</h1>
                <p>Ödünç verme ve iade süreçlerini yönetin</p>
            </div>

            {msg.text && (
                <div style={{
                    marginBottom: "20px", padding: "14px", borderRadius: "10px",
                    background: msg.type === "success" ? "#dcfce7" : "#fee2e2",
                    color: msg.type === "success" ? "#166534" : "#991b1b",
                    fontWeight: "600", textAlign: "center"
                }}>
                    {msg.text}
                </div>
            )}

            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px", marginBottom: "32px" }}>
                {/* Ödünç Al Kartı */}
                <div className="card" style={{ borderTop: "4px solid #3b82f6" }}>
                    <h3>📖 Kitap Ödünç Ver</h3>
                    <label>Kullanıcı Seç</label>
                    <select className="form-select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">-- Kullanıcı Seçin --</option>
                        {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>

                    <label>Kitap Seç</label>
                    <select className="form-select" value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
                        <option value="">-- Kitap Seçin --</option>
                        {books.map((b) => (
                            <option key={b.id} value={b.id} disabled={!b.available}>
                                {b.title} {b.available ? "✅" : "(Ödünçte ❌)"}
                            </option>
                        ))}
                    </select>

                    <button onClick={handleBorrow} disabled={!selectedUser || !selectedBook} className="btn-primary">
                        Ödünç İşlemini Onayla
                    </button>
                </div>

                {/* Manuel İade Kartı (Opsiyonel olarak duruyor) */}
                <div className="card" style={{ borderTop: "4px solid #f97316" }}>
                    <h3>↩️ Hızlı İade (ID ile)</h3>
                    <input
                        className="form-input"
                        placeholder="Loan ID giriniz..."
                        value={loanId}
                        onChange={(e) => setLoanId(e.target.value)}
                    />
                    <button onClick={() => handleReturn()} disabled={!loanId} className="btn-orange">
                        İadeyi Tamamla
                    </button>
                </div>
            </div>

            {/* GEÇMİŞ VE İADE TABLOSU */}
            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0 }}>📜 Ödünç Geçmişi ve İade Paneli</h3>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <select
                            className="form-select-sm"
                            value={historyUserId}
                            onChange={(e) => setHistoryUserId(e.target.value)}
                        >
                            <option value="">Kullanıcı Filtrele</option>
                            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                        <button onClick={loadHistory} className="btn-dark">Listele</button>
                    </div>
                </div>

                <div className="table-wrap">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Kitap</th>
                            <th>Durum</th>
                            <th>Alış Tarihi</th>
                            <th>İade Tarihi</th>
                            <th>İşlem</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">Kayıt bulunamadı.</td></tr>
                        ) : (
                            history.map((l) => (
                                <tr key={l.loanId || l.id}>
                                    <td>#{l.loanId || l.id}</td>
                                    <td>{l.bookTitle || l.book?.title}</td>
                                    <td>
                                            <span className={`badge ${l.status === "BORROWED" ? "warn" : "ok"}`}>
                                                {l.status}
                                            </span>
                                    </td>
                                    <td>{l.loanDate}</td>
                                    <td>{l.returnDate || "-"}</td>
                                    <td>
                                        {l.status === "BORROWED" && (
                                            <button
                                                onClick={() => handleReturn(l.loanId || l.id)}
                                                className="btn-return-sm"
                                            >
                                                İade Et
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
    );
}