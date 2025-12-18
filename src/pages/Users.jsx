import { useEffect, useState } from "react";
import { getAllUsers } from "../api/api";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data || []);
        } catch (err) {
            console.error("Kullanıcılar yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-500">Kullanıcılar yükleniyor...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kullanıcı Yönetimi</h1>
                    <p className="text-slate-500 mt-1 font-medium">Sisteme kayıtlı tüm üyelerin listesi.</p>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-xl transition-all active:scale-95">
                    ➕ Yeni Kullanıcı
                </button>
            </div>

            {/* USERS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-medium">
                        Henüz hiç kullanıcı kaydı yok.
                    </div>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all relative overflow-hidden group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    👤
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-lg leading-tight">{user.name}</h3>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                                        user.role === "ADMIN" ? "text-purple-600" : "text-slate-400"
                                    }`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1 mb-8">
                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                    <span className="opacity-50">📧</span> {user.email}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition">
                                    Düzenle
                                </button>
                                <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition">
                                    Sil
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Users;