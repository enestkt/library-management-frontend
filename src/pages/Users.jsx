import { useEffect, useState } from "react";
import { getAllUsers, api } from "../api/api";
import toast from "react-hot-toast";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "USER" });

    // LocalStorage'dan giriş yapan kullanıcıyı al
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = currentUser.role === "ADMIN";

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data || []);
        } catch (err) {
            toast.error("Kullanıcı listesi yüklenemedi");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            // Admin yetkisiyle yeni kullanıcı ekleme (Backend rotasına göre ayarlanmalı)
            await api.post("/auth/register", formData);
            toast.success("Kullanıcı başarıyla eklendi");
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) {
            toast.error("Kullanıcı eklenemedi");
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-500 animate-pulse">Yükleniyor...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kullanıcı Yönetimi</h1>
                    <p className="text-slate-500 mt-1 font-medium">Sistemdeki tüm üyeleri görüntüleyin.</p>
                </div>

                {/* SADECE ADMIN GÖREBİLİR */}
                {isAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-xl transition-all active:scale-95"
                    >
                        ➕ Yeni Kullanıcı Ekle
                    </button>
                )}
            </div>

            {/* USERS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all relative group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
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

                        {/* İŞLEMLER - SADECE ADMIN GÖREBİLİR */}
                        {isAdmin && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition">
                                    Düzenle
                                </button>
                                <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition">
                                    Sil
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* MODAL (Yalnızca Admin için) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">Yeni Kullanıcı Ekle</h2>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <input
                                className="w-full px-5 py-4 bg-slate-100 rounded-2xl border-none outline-none"
                                placeholder="Ad Soyad"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                            <input
                                className="w-full px-5 py-4 bg-slate-100 rounded-2xl border-none outline-none"
                                placeholder="E-posta"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                required
                            />
                            <input
                                className="w-full px-5 py-4 bg-slate-100 rounded-2xl border-none outline-none"
                                placeholder="Şifre"
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                required
                            />
                            <select
                                className="w-full px-5 py-4 bg-slate-100 rounded-2xl border-none outline-none"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold mt-4">Kaydet</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;