import { useEffect, useState } from "react";
import { getAllBooks } from "../api/bookService";
import { getAllLoans } from "../api/loanService";
import "../styles/layout.css";

/* ---------- STAT CARD ---------- */
function StatCard({ title, value, subtitle }) {
    return (
        <div className="card stat-card">
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
            {subtitle && <div className="stat-sub">{subtitle}</div>}
        </div>
    );
}

/* ---------- DASHBOARD ---------- */
export default function Dashboard() {
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalBooks: 0,
        availableBooks: 0,
        borrowedBooks: 0,
    });

    const [loanStats, setLoanStats] = useState({
        totalLoans: 0,
        activeLoans: 0,
        recent: [],
    });

    useEffect(() => {
        const run = async () => {
            try {
                /* ---- BOOK STATS ---- */
                const bookRes = await getAllBooks();
                const books = bookRes.data || [];

                const totalBooks = books.length;
                const availableBooks = books.filter(b => b.available).length;
                const borrowedBooks = totalBooks - availableBooks;

                setStats({
                    totalBooks,
                    availableBooks,
                    borrowedBooks,
                });

                /* ---- LOAN STATS ---- */
                const loanRes = await getAllLoans();
                const loans = loanRes.data || [];

                const activeLoans = loans.filter(l => l.status === "BORROWED");
                const recentLoans = [...loans]
                    .sort((a, b) => new Date(b.loanDate) - new Date(a.loanDate))
                    .slice(0, 5);

                setLoanStats({
                    totalLoans: loans.length,
                    activeLoans: activeLoans.length,
                    recent: recentLoans,
                });

            } finally {
                setLoading(false);
            }
        };

        run();
    }, []);

    return (
        <div className="page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Library overview (admin panel)</p>
            </div>

            {loading ? (
                <div className="card">Loading...</div>
            ) : (
                <>
                    {/* --- BOOK STATS --- */}
                    <div className="grid-3">
                        <StatCard title="Total Books" value={stats.totalBooks} />
                        <StatCard
                            title="Available"
                            value={stats.availableBooks}
                            subtitle="Ready to borrow"
                        />
                        <StatCard
                            title="Borrowed"
                            value={stats.borrowedBooks}
                            subtitle="Currently on loan"
                        />
                    </div>

                    {/* --- LOAN STATS --- */}
                    <div className="grid-3" style={{ marginTop: 16 }}>
                        <StatCard title="Total Loans" value={loanStats.totalLoans} />
                        <StatCard
                            title="Active Loans"
                            value={loanStats.activeLoans}
                            subtitle="Borrowed now"
                        />
                        <StatCard
                            title="Returned"
                            value={loanStats.totalLoans - loanStats.activeLoans}
                        />
                    </div>

                    {/* --- RECENT LOANS --- */}
                    <div className="card" style={{ marginTop: 16 }}>
                        <h3 style={{ marginTop: 0 }}>Recent Loans</h3>

                        <div className="table-wrap">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Book</th>
                                    <th>User</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {loanStats.recent.map(l => (
                                    <tr key={l.id}>
                                        <td>{l.id}</td>
                                        <td>{l.book?.title || "-"}</td>
                                        <td>{l.user?.email || "-"}</td>
                                        <td>
                                            <span
                                                className={
                                                    l.status === "BORROWED"
                                                        ? "badge warn"
                                                        : "badge ok"
                                                }
                                            >
                                                {l.status}
                                            </span>
                                        </td>
                                        <td>{l.loanDate}</td>
                                    </tr>
                                ))}

                                {loanStats.recent.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="empty">
                                            No loans yet.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
