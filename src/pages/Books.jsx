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
        if (!window.confirm("Delete this book?")) return;
        try {
            await deleteBook(id);
            setMsg("✅ Book deleted successfully");
            load();
        } catch {
            setMsg("❌ Delete failed");
        }
    };

    const filtered = books.filter((b) => {
        const t = (b.title || "").toLowerCase();
        const i = (b.isbn || "").toLowerCase();
        return t.includes(q.toLowerCase()) || i.includes(q.toLowerCase());
    });

    return (
        <div className="page">
            <div className="page-header row-between">
                <div>
                    <h1>Books</h1>
                    <p>All books in database</p>
                </div>

                <input
                    className="input"
                    placeholder="Search title / isbn..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    style={{ width: 260 }}
                />
            </div>

            {msg && <div className="card info">{msg}</div>}

            <div className="card">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>ISBN</th>
                                <th>Title</th>
                                <th>Available</th>
                                <th style={{ width: 120 }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map((b) => (
                                <tr key={b.id}>
                                    <td>{b.id}</td>
                                    <td>{b.isbn}</td>
                                    <td className="td-title">{b.title}</td>
                                    <td>
                                            <span className={`badge ${b.available ? "green" : "red"}`}>
                                                {b.available ? "YES" : "NO"}
                                            </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-danger"
                                            onClick={() => handleDelete(b.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="empty">
                                        No books found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
