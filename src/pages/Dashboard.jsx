import { useEffect, useState } from "react";

function Dashboard() {
    const [stats, setStats] = useState({
        totalBooks: 0,
        activeLoans: 0,
        availableBooks: 0,
        totalUsers: 0,
    });

    // örnek – senin API call’un varsa burada kalır
    useEffect(() => {
        // fetchStats()
    }, []);

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900">
                    Dashboard
                </h1>
                <p className="text-slate-500 mt-1">
                    Kütüphane genel durumu
                </p>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Toplam Kitap"
                    value={stats.totalBooks}
                    color="from-indigo-500 to-indigo-600"
                    icon="📚"
                />
                <StatCard
                    title="Aktif Ödünç"
                    value={stats.activeLoans}
                    color="from-orange-500 to-orange-600"
                    icon="🔄"
                />
                <StatCard
                    title="Uygun Kitap"
                    value={stats.availableBooks}
                    color="from-green-500 to-green-600"
                    icon="✅"
                />
                <StatCard
                    title="Toplam Kullanıcı"
                    value={stats.totalUsers}
                    color="from-purple-500 to-purple-600"
                    icon="👥"
                />
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* RECENT ACTIVITY */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
                    <h3 className="text-lg font-bold mb-4">
                        Son İşlemler
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-slate-500 border-b">
                            <tr>
                                <th className="text-left py-3">Kitap</th>
                                <th className="text-left py-3">Kullanıcı</th>
                                <th className="text-left py-3">Durum</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="border-b last:border-0 hover:bg-slate-50 transition">
                                <td className="py-3 font-medium">
                                    Örnek Kitap
                                </td>
                                <td className="py-3">Ali Veli</td>
                                <td className="py-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                            Teslim
                                        </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow">
                    <h3 className="text-lg font-extrabold mb-2">
                        Hızlı İşlemler
                    </h3>
                    <p className="text-sm text-slate-300 mb-6">
                        Kütüphaneyi hızlıca yönet
                    </p>

                    <div className="space-y-3">
                        <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold">
                            📖 Yeni Kitap Ekle
                        </button>
                        <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold">
                            👥 Kullanıcıları Yönet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* STAT CARD COMPONENT */
function StatCard({ title, value, color, icon }) {
    return (
        <div
            className={`bg-gradient-to-br ${color} text-white rounded-2xl p-6 shadow flex flex-col`}
        >
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold opacity-90">
                    {title}
                </span>
                <span className="text-2xl">{icon}</span>
            </div>

            <div className="text-4xl font-extrabold">
                {value}
            </div>
        </div>
    );
}

export default Dashboard;
