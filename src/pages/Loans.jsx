import { useEffect, useState } from "react";
import { borrowBook, returnBook, getUserLoans, getAllUsers, getAllBooks } from "../api/loanService";
import "../styles/pages.css";
import "../styles/loans.css";

export default function Loans() {
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedBook, setSelectedBook] = useState("");
    const [loanId, setLoanId] = useState("");

    const [historyUserId, setHistoryUserId] = useState("");
    const [history, setHistory] = useState([]);
    const [msg, setMsg] = useState({ text: "", type: "" });

    useEffect(() => {
        const load = async () => {
            const u = await getAllUsers();
            const b = await getAllBooks();
            setUsers(u.data || []);
            setBooks(b.data || []);
        };
        load();
    }, []);

    const handleBorrow = async () => {
        try {
            await borrowBook(selectedBook, selectedUser);
            setMsg({ text: "✅ Kitap başarıyla ödünç verildi!", type: "success" });
            // Kitap listesini yenile ki o kitap 'Available' olmaktan çıksın
            const b = await getAllBooks();
            setBooks(b.data || []);
        } catch {
            setMsg({ text: "❌ Hata oluştu! Kitap müsait olmayabilir.", type: "error" });
        }
    };

    const handleReturn = async () => {
        try {
            await returnBook(loanId);
            setMsg({ text: "✅ Kitap başarıyla iade alındı!", type: "success" });
            const b = await getAllBooks(); // Kitabı tekrar müsait yap
            setBooks(b.data || []);
        } catch {
            setMsg({ text: "❌ İade işlemi başarısız.", type: "error" });
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

    // Style helper for inputs
    const inputStyle = {
        width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1",
        backgroundColor: "#f8fafc", fontSize: "14px", marginBottom: "16px", outline: "none"
    };

    const btnStyle = {
        width: "100%", padding: "12px", borderRadius: "8px", border: "none",
        color: "white", fontWeight: "600", cursor: "pointer", transition: "0.2s"
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Loan Operations</h1>
                <p>Process book borrowing and returns</p>
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

                {/* --- BORROW CARD --- */}
                <div className="card" style={{ borderTop: "4px solid #3b82f6" }}>
                    <h3 style={{ marginTop: 0, color: "#1e293b" }}>📖 Borrow a Book</h3>
                    <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>Select a user and an available book.</p>

                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Select User</label>
                    <select style={inputStyle} value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">-- Choose User --</option>
                        {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                    </select>

                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Select Book</label>
                    <select style={inputStyle} value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
                        <option value="">-- Choose Book --</option>
                        {books.map((b) => (
                            <option key={b.id} value={b.id} disabled={!b.available}>
                                {b.title} {b.available ? "✅" : "(Borrowed ❌)"}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleBorrow} disabled={!selectedUser || !selectedBook}
                        style={{ ...btnStyle, backgroundColor: "#3b82f6" }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
                    >
                        Confirm Borrow
                    </button>
                </div>

                {/* --- RETURN CARD --- */}
                <div className="card" style={{ borderTop: "4px solid #f97316" }}>
                    <h3 style={{ marginTop: 0, color: "#1e293b" }}>↩️ Return a Book</h3>
                    <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>Enter the Loan ID to process return.</p>

                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Loan ID</label>
                    <input
                        style={inputStyle}
                        placeholder="Enter Loan ID (e.g. 5)"
                        value={loanId}
                        onChange={(e) => setLoanId(e.target.value)}
                    />

                    <div style={{ height: "76px" }}></div> {/* Spacer to align buttons */}

                    <button
                        onClick={handleReturn} disabled={!loanId}
                        style={{ ...btnStyle, backgroundColor: "#f97316" }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#ea580c"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#f97316"}
                    >
                        Confirm Return
                    </button>
                </div>
            </div>

            {/* --- HISTORY SECTION --- */}
            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0 }}>📜 Loan History</h3>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <select
                            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                            value={historyUserId}
                            onChange={(e) => setHistoryUserId(e.target.value)}
                        >
                            <option value="">Filter by User</option>
                            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                        <button
                            onClick={loadHistory} disabled={!historyUserId}
                            style={{ padding: "8px 16px", background: "#475569", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                        >
                            Load
                        </button>
                    </div>
                </div>

                <div className="table-wrap">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>Book Title</th>
                            <th>Status</th>
                            <th>Loan Date</th>
                            <th>Return Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No records found. Select a user to view history.</td></tr>
                        ) : (
                            history.map((l) => (
                                <tr key={l.loanId || l.id}>
                                    <td style={{ fontWeight: "600", color: "#64748b" }}>#{l.loanId || l.id}</td>
                                    <td style={{ fontWeight: "500", color: "#0f172a" }}>{l.bookTitle || l.book?.title}</td>
                                    <td>
                                            <span className={`badge ${l.status === "BORROWED" ? "warn" : "ok"}`}>
                                                {l.status}
                                            </span>
                                    </td>
                                    <td>{l.loanDate}</td>
                                    <td>{l.returnDate || "-"}</td>
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