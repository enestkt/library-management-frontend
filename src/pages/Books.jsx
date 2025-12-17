import { useEffect, useState } from "react";
import { getAllBooks, deleteBook } from "../api/bookService";
import { borrowBook } from "../api/loanService"; // Ödünç alma fonksiyonu
import "../styles/pages.css";
import "../styles/books.css";

export default function Books() {
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [q, setQ] = useState("");
    const [msg, setMsg] = useState("");

    // Giriş yapan kullanıcının bilgilerini al
    const role = localStorage.getItem("role");
    const currentUserId = localStorage.getItem("userId");

    const load = async () => {
        setLoading(true);
        try {
            const res = await getAllBooks();
            setBooks(res.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // ADMİN İÇİN SİLME
    const handleDelete = async (id) => {
        if (!window.confirm("Bu kitabı silmek istediğinize emin misiniz?")) return;
        try {
            await deleteBook(id);
            setMsg("✅ Kitap başarıyla silindi");
            load();
            setTimeout(() => setMsg(""), 3000);
        } catch {
            setMsg("❌ Silme işlemi başarısız oldu");
        }
    };

    // USER İÇİN ÖDÜNÇ ALMA
    const handleBorrow = async (bookId) => {
        if (!window.confirm("Bu kitabı ödünç almak istiyor musunuz?")) return;
        try {
            // Service'e Kitap ID ve Kullanıcı ID gönderiyoruz
            await borrowBook(bookId, currentUserId);
            setMsg("✅ Kitap başarıyla ödünç alındı! Keyifli okumalar.");
            load(); // Listeyi yenile (Kitap artık müsait olmayacak)
            setTimeout(() => setMsg(""), 3000);
        } catch (error) {
            setMsg("❌ Ödünç alma başarısız! (Kitap başkasında olabilir)");
        }
    };

    const filtered = books.filter((b) => {
        const t = (b.title || "").toLowerCase();
        const i = (b.isbn || "").toLowerCase();
        return t.includes(q.toLowerCase()) || i.includes(q.toLowerCase());
    });

    return (
        <div className="page">
            {/* HEADER & SEARCH */}
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                <div>
                    <h1>Library Inventory</h1>
                    <p>Browse and borrow books from our collection</p>
                </div>

                <div style={{ position: "relative" }}>
                    <input
                        className="input"
                        placeholder="🔍 Search title or ISBN..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        style={{
                            width: "300px",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            border: "1px solid #cbd5e1",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                        }}
                    />
                </div>
            </div>

            {/* NOTIFICATION */}
            {msg && (
                <div style={{
                    marginBottom: "20px", padding: "12px", borderRadius: "8px",
                    background: msg.includes("✅") ? "#dcfce7" : "#fee2e2",
                    color: msg.includes("✅") ? "#166534" : "#991b1b",
                    fontWeight: "600"
                }}>
                    {msg}
                </div>
            )}

            {/* TABLE */}
            <div className="card" style={{ padding: "0", overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading books...</div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                            <tr>
                                <th style={{ width: "80px" }}>Img</th>
                                <th>Book Details</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>No books found.</td></tr>
                            ) : (
                                filtered.map((b) => (
                                    <tr key={b.id}>
                                        <td>
                                            <div style={{
                                                width: "45px", height: "65px", background: "#f1f5f9", borderRadius: "6px",
                                                overflow: "hidden", border: "1px solid #e2e8f0"
                                            }}>
                                                {b.imageUrl ? (
                                                    <img src={b.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📖</div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: "600", color: "#0f172a", fontSize: "15px" }}>{b.title}</div>
                                            <div style={{ fontSize: "13px", color: "#64748b" }}>
                                                {b.authorName || "Unknown Author"} • <span style={{color: "#3b82f6"}}>{b.categoryName || "General"}</span>
                                            </div>
                                            <div style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace", marginTop: "2px" }}>
                                                ISBN: {b.isbn}
                                            </div>
                                        </td>
                                        <td>
                                                <span className={`badge ${b.available ? "green" : "red"}`}>
                                                    {b.available ? "Available" : "Borrowed"}
                                                </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            {/* DURUM 1: ADMIN GÖRÜRSE -> SİLME BUTONU */}
                                            {role === "ADMIN" && (
                                                <button
                                                    className="btn-danger"
                                                    onClick={() => handleDelete(b.id)}
                                                >
                                                    Delete
                                                </button>
                                            )}

                                            {/* DURUM 2: USER GÖRÜRSE VE MÜSAİTSE -> ÖDÜNÇ AL */}
                                            {role === "USER" && b.available && (
                                                <button
                                                    style={{
                                                        background: "#2563eb", color: "white", border: "none",
                                                        padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
                                                        fontWeight: "500", fontSize: "13px",
                                                        boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)"
                                                    }}
                                                    onClick={() => handleBorrow(b.id)}
                                                >
                                                    Borrow
                                                </button>
                                            )}

                                            {/* DURUM 3: USER GÖRÜRSE VE DOLUYSA -> UYARI */}
                                            {role === "USER" && !b.available && (
                                                <span style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic", paddingRight: "10px" }}>
                                                        Currently Unavailable
                                                    </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}