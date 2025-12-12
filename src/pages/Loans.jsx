import { useEffect, useState } from "react";
import {
    borrowBook,
    returnBook,
    getUserLoans,
    getAllUsers,
    getAllBooks
} from "../api/loanService";

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
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("");

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
            setMsg("Borrow success");
            setMsgType("success");
        } catch {
            setMsg("Borrow failed");
            setMsgType("error");
        }
    };

    const handleReturn = async () => {
        try {
            await returnBook(loanId);
            setMsg("Return success");
            setMsgType("success");
        } catch {
            setMsg("Return failed");
            setMsgType("error");
        }
    };

    const loadHistory = async () => {
        try {
            const res = await getUserLoans(historyUserId);
            setHistory(res.data || []);
            setMsgType("");
        } catch {
            setMsg("History fetch failed");
            setMsgType("error");
            setHistory([]);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Loans</h1>
                <p>Borrow / Return management</p>
            </div>

            {msg && <div className={`card info ${msgType}`}>{msg}</div>}

            <div className="grid-2">
                {/* BORROW */}
                <div className="card">
                    <h3>Borrow a Book</h3>

                    <select
                        className="input"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Select User</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name} ({u.email})
                            </option>
                        ))}
                    </select>

                    <select
                        className="input"
                        value={selectedBook}
                        onChange={(e) => setSelectedBook(e.target.value)}
                    >
                        <option value="">Select Book</option>
                        {books.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.title} {b.available ? "" : "(Borrowed)"}
                            </option>
                        ))}
                    </select>

                    <button
                        className="btn primary"
                        onClick={handleBorrow}
                        disabled={!selectedUser || !selectedBook}
                    >
                        Borrow
                    </button>
                </div>

                {/* RETURN */}
                <div className="card">
                    <h3>Return a Book</h3>

                    <input
                        className="input"
                        placeholder="loanId"
                        value={loanId}
                        onChange={(e) => setLoanId(e.target.value)}
                    />

                    <button
                        className="btn primary"
                        onClick={handleReturn}
                        disabled={!loanId}
                    >
                        Return
                    </button>
                </div>
            </div>

            {/* HISTORY */}
            <div className="card" style={{ marginTop: 16 }}>
                <h3>User Loan History</h3>

                <select
                    className="input"
                    value={historyUserId}
                    onChange={(e) => setHistoryUserId(e.target.value)}
                >
                    <option value="">Select User</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name} ({u.email})
                        </option>
                    ))}
                </select>

                <button className="btn" onClick={loadHistory} disabled={!historyUserId}>
                    Load History
                </button>

                <div className="table-wrap">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>Book</th>
                            <th>Status</th>
                            <th>Loan Date</th>
                            <th>Return Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map((l) => (
                            <tr key={l.id}>
                                <td>{l.id}</td>
                                <td>{l.book?.title}</td>
                                <td>
                                    <span className={l.status === "BORROWED" ? "badge warn" : "badge ok"}>
                                        {l.status}
                                    </span>
                                </td>
                                <td>{l.loanDate}</td>
                                <td>{l.returnDate || "-"}</td>
                            </tr>
                        ))}
                        {history.length === 0 && (
                            <tr>
                                <td colSpan="5" className="empty">
                                    No history
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
