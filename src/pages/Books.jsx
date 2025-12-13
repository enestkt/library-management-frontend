import { useEffect, useState } from "react";
import { getAllBooks, deleteBook } from "../api/bookService";
import "../styles/pages.css";
import "../styles/books.css";

export default function Books() {
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [q, setQ] = useState("");
    const [msg, setMsg] = useState("");

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

    const handleDelete = async (id) => {
        if (!window.confirm("Bu kitabı silmek istediğinize emin misiniz?")) return;
        try {
            await deleteBook(id);
            setMsg("✅ Kitap başarıyla silindi");
            load();
            setTimeout(() => setMsg(""), 3000); // 3 saniye sonra mesajı sil
        } catch {
            setMsg("❌ Silme işlemi başarısız oldu");
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
                    <h1>Books Management</h1>
                    <p>View and manage library inventory</p>
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
                    fontWeight: "500"
                }}>
                    {msg}
                </div>
            )}

            {/* TABLE CARD */}
            <div className="card" style={{ padding: "0", overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading books data...</div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                            <tr>
                                <th style={{ width: "80px" }}>ID</th>
                                <th>Image</th>
                                <th>Book Details</th>
                                <th>ISBN</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No books found matching your search.</td></tr>
                            ) : (
                                filtered.map((b) => (
                                    <tr key={b.id}>
                                        <td style={{ color: "#94a3b8", fontWeight: "500" }}>#{b.id}</td>
                                        <td>
                                            <div style={{
                                                width: "40px", height: "60px", background: "#f1f5f9", borderRadius: "4px",
                                                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
                                            }}>
                                                {b.imageUrl ? <img src={b.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📖"}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: "600", color: "#0f172a", fontSize: "15px" }}>{b.title}</div>
                                            <div style={{ fontSize: "13px", color: "#64748b" }}>{b.authorName || "Unknown Author"}</div>
                                        </td>
                                        <td style={{ fontFamily: "monospace", color: "#475569" }}>{b.isbn}</td>
                                        <td>
                                                <span className={`badge ${b.available ? "green" : "red"}`}>
                                                    {b.available ? "Available" : "Borrowed"}
                                                </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                className="btn-danger"
                                                onClick={() => handleDelete(b.id)}
                                                style={{ fontSize: "12px", padding: "6px 12px" }}
                                            >
                                                Delete
                                            </button>
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