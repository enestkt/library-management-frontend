import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Fonksiyon ismi api.js ile uyumlu hale getirildi (getAllBooks)
import { getAllBooks, getAllLoans, getAllUsers } from "../api/api";
import toast from "react-hot-toast";

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBooks: 0,
        activeLoans: 0,
        availableBooks: 0,
        totalUsers: 0,
    });
    const [recentLoans, setRecentLoans] = useState([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Verileri paralel çekiyoruz
                const [booksRes, loansRes, usersRes] = await Promise.all([
                    getAllBooks(),
                    getAllLoans(),
                    getAllUsers()
                ]);

                const books = booksRes.data || [];
                const loans = loansRes.data || [];
                const users = usersRes.data || [];

                // Veritabanındaki 'available' alanına göre filtreleme
                const available = books.filter(b => b.available).length;
                const active = loans.filter(l => l.status === "BORROWED").length;

                setStats({
                    totalBooks: books.length,
                    activeLoans: active,
                    availableBooks: available,
                    totalUsers: users.length,
                });

                // Son 5 işlemi tarihe göre sırala
                const sortedLoans = [...loans]
                    .sort((a, b) => new Date(b.loanDate) - new Date(a.loanDate))
                    .slice(0, 5);
                setRecentLoans(sortedLoans);

            } catch (err) {
                console.error("Dashboard veri hatası:", err);
                toast.error("İstatistikler yüklenemedi");
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kontrol Paneli</h1>
                <p className="text-slate-500 mt-2 font-medium">Kütüphane sistemindeki güncel özet veriler.</p>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Toplam Kitap" value={stats.totalBooks} color="from-blue-600 to-indigo-700" icon="📚" />
                <StatCard title="Aktif Ödünç" value={stats.activeLoans} color="from-orange-500 to-red-600" icon="🔄" />
                <StatCard title="Müsait Kitap" value={stats.availableBooks} color="from-emerald-500 to-teal-600" icon="✅" />
                <StatCard title="Toplam Kullanıcı" value={stats.totalUsers} color="from-purple-600 to-pink-700" icon="👥" />
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SON İŞLEMLER */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-800">Son İşlemler</h3>
                        <Link to="/dashboard/loans" className="text-blue-600 font-bold text-sm hover:underline">Tümünü Gör →</Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-50">
                            <tr>
                                <th className="pb-4 px-2">Kitap İsmi</th>
                                <th className="pb-4 px-2">Kullanıcı</th>
                                <th className="pb-4 px-2">Durum</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {recentLoans.map((loan) => (
                                <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                                    {/* DÜZELTİLDİ: loan.bookTitle kullanıldı */}
                                    <td className="py-5 px-2 font-bold text-slate-700">{loan.bookTitle}</td>
                                    {/* DÜZELTİLDİ: loan.userName kullanıldı */}
                                    <td className="py-5 px-2 text-slate-500 font-medium">{loan.userName || "Sistem"}</td>
                                    <td className="py-5 px-2">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                loan.status === "BORROWED"
                                                    ? "bg-orange-100 text-orange-700"
                                                    : "bg-emerald-100 text-emerald-700"
                                            }`}>
                                                {loan.status === "BORROWED" ? "Ödünçte" : "İade"}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-125"></div>
                    <h3 className="text-2xl font-black text-white mb-2 relative z-10">Hızlı Menü</h3>
                    <p className="text-sm text-slate-400 mb-10 relative z-10 font-bold uppercase tracking-widest">Yönetim Paneli</p>

                    <div className="space-y-4 relative z-10">
                        <Link to="/dashboard/books" className="flex items-center justify-center w-full py-5 rounded-2xl bg-white/5 hover:bg-white text-white hover:text-slate-900 transition-all duration-300 font-black uppercase tracking-widest text-xs">
                            📖 Kitap Arşivi
                        </Link>
                        <Link to="/dashboard/users" className="flex items-center justify-center w-full py-5 rounded-2xl bg-white/5 hover:bg-white text-white hover:text-slate-900 transition-all duration-300 font-black uppercase tracking-widest text-xs">
                            👥 Üye Yönetimi
                        </Link>
                        <Link to="/dashboard/loans" className="flex items-center justify-center w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-900/20">
                            🔄 Ödünç Ver/Al
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color, icon }) {
    return (
        <div className={`bg-gradient-to-br ${color} text-white rounded-[2rem] p-8 shadow-xl flex flex-col relative overflow-hidden group transition-transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-6 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{title}</span>
                <span className="text-3xl opacity-40 group-hover:opacity-100 transition-opacity">{icon}</span>
            </div>
            <div className="text-5xl font-black relative z-10 tracking-tighter">{value}</div>
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 pointer-events-none group-hover:rotate-12 transition-transform">{icon}</div>
        </div>
    );
}

export default Dashboard;