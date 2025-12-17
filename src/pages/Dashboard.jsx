import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBooks } from "../api/bookService";
import { getAllLoans } from "../api/loanService";
import "../styles/layout.css";
import "../styles/dashboard.css"; // Yeni CSS dosyamızı import ettiğinden emin ol

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
        <div className="progress-container">
            <div className="progress-info">
                <span>{label}</span>
                <span>{value} / {total} ({percent}%)</span>
            </div>
            <div className="progress-bar-bg">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percent}%`, background: color }}
                ></div>
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
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setToday(new Date().toLocaleDateString('tr-TR', dateOptions));

        const loadDashboard = async () => {
            try {
                const [bookRes, loanRes] = await Promise.all([getAllBooks(), getAllLoans()]);

                const books = bookRes.data || [];
                const loans = loanRes.data || [];

                const availableBooks = books.filter(b => b.available).length;
                const activeLoans = loans.filter(l => l.status === "BORROWED");

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
            <div className="loading-screen">
                <div className="loader-text">Dashboard verileri yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="page">
            {/* HEADER */}
            <div className="page-header">
                <div>
                    <h1>Kontrol Paneli</h1>
                    <p>Tekrar hoş geldiniz, Yönetici 👋</p>
                </div>
                <div className="date-display">
                    {today}
                </div>
            </div>

            {/* STAT KARTLARI */}
            <div className="grid-stats">
                <StatCard
                    title="Toplam Kitap"
                    value={bookStats.total}
                    icon="📚"
                    colorClass="card-blue"
                />
                <StatCard
                    title="Aktif Ödünçler"
                    value={loanStats.active}
                    icon="⏳"
                    colorClass="card-orange"
                />
                <StatCard
                    title="Müsait Kitaplar"
                    value={bookStats.available}
                    icon="✅"
                    colorClass="card-green"
                />
                <StatCard
                    title="Toplam Kullanıcı"
                    value={loanStats.total}
                    icon="👥"
                    colorClass="card-purple"
                />
            </div>

            {/* ANA ALAN */}
            <div className="dashboard-main-grid">

                {/* SON İŞLEMLER */}
                <div className="card recent-activity">
                    <div className="card-header">
                        <h3>Son İşlemler</h3>
                        <Link to="/dashboard/loans" className="view-all">
                            Tümünü Gör →
                        </Link>
                    </div>

                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Kitap Adı</th>
                                <th>Kullanıcı</th>
                                <th>Tarih</th>
                                <th>Durum</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loanStats.recent.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="empty-row">
                                        Herhangi bir işlem bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                loanStats.recent.map(l => (
                                    <tr key={l.id}>
                                        <td className="td-title">{l.book?.title || "Bilinmeyen Kitap"}</td>
                                        <td>{l.user?.email || "Bilinmeyen Kullanıcı"}</td>
                                        <td className="td-date">{l.loanDate}</td>
                                        <td>
                                            <span className={`badge ${l.status === "BORROWED" ? "warn" : "ok"}`}>
                                                {l.status === "BORROWED" ? "Ödünçte" : "İade Edildi"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SAĞ PANEL */}
                <div className="side-panels">

                    <div className="card status-card">
                        <h3>Kütüphane Durumu</h3>
                        <div className="progress-section">
                            <ProgressBar
                                label="Müsait Kitaplar"
                                value={bookStats.available}
                                total={bookStats.total}
                                color="#22c55e"
                            />
                            <ProgressBar
                                label="Ödünçteki Kitaplar"
                                value={bookStats.borrowed}
                                total={bookStats.total}
                                color="#f97316"
                            />
                        </div>
                    </div>

                    <div className="card quick-actions-dark">
                        <h3>Hızlı İşlemler</h3>
                        <p>Kütüphanenizi hızlı ve kolay yönetin.</p>

                        <div className="action-buttons">
                            <Link to="/dashboard/books" className="btn-glass">
                                + Yeni Kitap Ekle
                            </Link>
                            <Link to="/dashboard/users" className="btn-glass">
                                Kullanıcıları Yönet
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}