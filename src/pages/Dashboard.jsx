import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Link eklendi
import { getAllBooks } from "../api/bookService";
import { getAllLoans } from "../api/loanService";
import "../styles/layout.css";
// Not: CSS dosyasını ayrıca değiştirmene gerek yok, mevcut classları
// daha akıllıca kullanarak yerleşimi düzelttik.

/* ---------- STAT CARD COMPONENT ---------- */
function StatCard({ title, value, icon, colorClass }) {
    return (
        <div className={`card stat-card ${colorClass}`}>
            <div className="stat-header">
                <span className="stat-title">{title}</span>
                <span className="stat-icon">{icon}</span>
            </div>
            <div className="stat-value">{value}</div>
        </div>
    );
}

/* ---------- PROGRESS BAR COMPONENT ---------- */
function ProgressBar({ label, value, total, color }) {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                <span>{label}</span>
                <span>{value} / {total} ({percent}%)</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{ width: `${percent}%`, height: "100%", background: color, borderRadius: "99px", transition: "width 0.5s ease" }}></div>
            </div>
        </div>
    );
}

/* ---------- DASHBOARD MAIN ---------- */
export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [today, setToday] = useState("");

    const [bookStats, setBookStats] = useState({
        total: 0,
        available: 0,
        borrowed: 0,
    });

    const [loanStats, setLoanStats] = useState({
        total: 0,
        active: 0,
        recent: [],
    });

    useEffect(() => {
        // Tarihi ayarla
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setToday(new Date().toLocaleDateString('en-US', dateOptions));

        const loadDashboard = async () => {
            try {
                // Verileri Çek
                const [bookRes, loanRes] = await Promise.all([getAllBooks(), getAllLoans()]);

                const books = bookRes.data || [];
                const loans = loanRes.data || [];

                // İstatistikleri Hesapla
                const availableBooks = books.filter(b => b.available).length;
                const activeLoans = loans.filter(l => l.status === "BORROWED");

                // Son 5 işlemi tarihe göre sırala
                const recentLoans = [...loans]
                    .sort((a, b) => new Date(b.loanDate) - new Date(a.loanDate))
                    .slice(0, 5);

                setBookStats({
                    total: books.length,
                    available: availableBooks,
                    borrowed: books.length - availableBooks,
                });

                setLoanStats({
                    total: loans.length,
                    active: activeLoans.length,
                    recent: recentLoans,
                });

            } catch (err) {
                console.error("Dashboard yüklenirken hata:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="page" style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"80vh" }}>
                <div style={{ fontSize: "18px", color: "#64748b" }}>Loading dashboard data...</div>
            </div>
        );
    }

    return (
        <div className="page">
            {/* 1. HEADER BÖLÜMÜ */}
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, Admin 👋</p>
                </div>
                <div style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "500" }}>
                    {today}
                </div>
            </div>

            {/* 2. ANA İSTATİSTİK KARTLARI (4'lü Grid) */}
            <div className="grid-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginBottom: "32px" }}>
                <StatCard
                    title="Total Books"
                    value={bookStats.total}
                    icon="📚"
                    colorClass="card-blue"
                />
                <StatCard
                    title="Active Loans"
                    value={loanStats.active}
                    icon="⏳"
                    colorClass="card-orange"
                />
                <StatCard
                    title="Available"
                    value={bookStats.available}
                    icon="✅"
                    colorClass="card-green"
                />
                <StatCard
                    title="Total Users"
                    value={loanStats.total} // Geçici olarak loan total kullandık, user sayısı varsa onu koy
                    icon="👥"
                    colorClass="card-purple"
                />
            </div>

            {/* 3. PARÇALI GÖRÜNÜM (Tablo + Durum Paneli) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>

                {/* SOL: Son İşlemler Tablosu (Geniş Alan) */}
                <div className="card" style={{ gridColumn: "span 2" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h3>Recent Transactions</h3>
                        <Link to="/dashboard/loans" style={{ fontSize: "13px", color: "#3b82f6", textDecoration: "none", fontWeight: "600" }}>
                            View All &rarr;
                        </Link>
                    </div>

                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loanStats.recent.length === 0 ? (
                                <tr><td colSpan="4" style={{textAlign:"center", color:"#94a3b8", padding:"20px"}}>No activity found.</td></tr>
                            ) : (
                                loanStats.recent.map(l => (
                                    <tr key={l.id}>
                                        <td className="td-title">{l.book?.title || "Unknown Book"}</td>
                                        <td>{l.user?.email || "Unknown User"}</td>
                                        <td style={{ color: "#64748b", fontSize: "13px" }}>{l.loanDate}</td>
                                        <td>
                                                <span className={`badge ${l.status === "BORROWED" ? "warn" : "ok"}`}>
                                                    {l.status}
                                                </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SAĞ: Kütüphane Durumu & Hızlı İşlemler (Dar Alan) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                    {/* Durum Çubukları */}
                    <div className="card">
                        <h3>Library Status</h3>
                        <div style={{ marginTop: "20px" }}>
                            <ProgressBar
                                label="Books Available"
                                value={bookStats.available}
                                total={bookStats.total}
                                color="#22c55e"
                            />
                            <ProgressBar
                                label="Books Borrowed"
                                value={bookStats.borrowed}
                                total={bookStats.total}
                                color="#f97316"
                            />
                        </div>
                    </div>

                    {/* Hızlı İşlemler */}
                    <div className="card" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "white" }}>
                        <h3 style={{ color: "white", marginBottom: "10px" }}>Quick Actions</h3>
                        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>Manage your library efficiently.</p>

                        <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                            <Link to="/dashboard/books" style={{
                                textAlign: "center", padding: "10px", background: "rgba(255,255,255,0.1)",
                                color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "0.2s"
                            }}>
                                + Add New Book
                            </Link>
                            <Link to="/dashboard/users" style={{
                                textAlign: "center", padding: "10px", background: "rgba(255,255,255,0.1)",
                                color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "0.2s"
                            }}>
                                Manage Users
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}