import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBooks, getAllLoans, getAllUsers } from "../api/api";

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
                // Tüm verileri paralel olarak çekiyoruz
                const [booksRes, loansRes, usersRes] = await Promise.all([
                    getAllBooks(),
                    getAllLoans(),
                    getAllUsers()
                ]);

                const books = booksRes.data || [];
                const loans = loansRes.data || [];
                const users = usersRes.data || [];

                const available = books.filter(b => b.available).length;
                const active = loans.filter(l => l.status === "BORROWED").length;

                setStats({
                    totalBooks: books.length,
                    activeLoans: active,
                    availableBooks: available,
                    totalUsers: users.length,
                });

                // Son 5 işlemi tarihe göre sıralayıp alıyoruz
                const sortedLoans = [...loans]
                    .sort((a, b) => new Date(b.loanDate) - new Date(a.loanDate))
                    .slice(0, 5);
                setRecentLoans(sortedLoans);

            } catch (err) {
                console.error("Veri yükleme hatası:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96 text-slate-500 font-medium animate-pulse">
                Veriler yükleniyor...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Kontrol Paneli
                </h1>
                <p className="text-slate-500 mt-1 font-medium">
                    Kütüphane sistemindeki güncel özet veriler.
                </p>
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
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">Son İşlemler</h3>
                        <Link to="/dashboard/loans" className="text-blue-600 font-semibold text-sm hover:underline">Tümünü Gör →</Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-slate-400 font-bold border-b border-slate-50 uppercase tracking-wider text-[11px]">
                            <tr>
                                <th className="pb-4">Kitap</th>
                                <th className="pb-4">Kullanıcı</th>
                                <th className="pb-4">Durum</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {recentLoans.map((loan) => (
                                <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                                    {/* Backend'den gelen düz yapıya göre düzeltildi (DTO uyumlu) */}
                                    <td className="py-4 font-semibold text-slate-700">{loan.bookTitle}</td>
                                    <td className="py-4 text-slate-500">{loan.userName}</td>
                                    <td className="py-4">
                                            <span className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest ${
                                                loan.status === "BORROWED"
                                                    ? "bg-amber-100 text-amber-700"
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
                <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                    <h3 className="text-xl font-bold text-white mb-2 relative z-10">Hızlı İşlemler</h3>
                    <p className="text-sm text-slate-400 mb-8 relative z-10 font-medium">Sistemi buradan yönetin</p>

                    <div className="space-y-4 relative z-10">
                        <Link to="/dashboard/books" className="flex items-center justify-center w-full py-4 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-slate-900 transition-all duration-300 font-bold text-sm">
                            📖 Kitap Arşivi
                        </Link>
                        <Link to="/dashboard/users" className="flex items-center justify-center w-full py-4 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-slate-900 transition-all duration-300 font-bold text-sm">
                            👥 Kullanıcıları Yönet
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color, icon }) {
    return (
        <div className={`bg-gradient-to-br ${color} text-white rounded-3xl p-7 shadow-lg shadow-indigo-100 flex flex-col relative overflow-hidden group transition-transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-6 relative z-10">
                <span className="text-[11px] font-black uppercase tracking-widest opacity-80">{title}</span>
                <span className="text-3xl opacity-30 group-hover:opacity-100 transition-opacity">{icon}</span>
            </div>
            <div className="text-4xl font-black relative z-10">{value}</div>
            <div className="absolute -right-2 -bottom-2 text-7xl opacity-10 pointer-events-none group-hover:rotate-12 transition-transform">{icon}</div>
        </div>
    );
}

export default Dashboard;