import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, register } from "../api/api"; // register fonksiyonunu ekledik
import toast from "react-hot-toast";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Yeni kullanıcı formu için state
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        name: ""
    });

    let currentUser = null;
    try {
        const rawUser = localStorage.getItem("user");
        currentUser = rawUser && rawUser !== "undefined"
            ? JSON.parse(rawUser)
            : null;
    } catch (e) {
        currentUser = null;
    }

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsers();
            setUsers(res.data || []);
        } catch (err) {
            console.error("Kullanıcılar yüklenemedi:", err);
            toast.error("Kullanıcı listesi alınamadı.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (id === currentUser.userId) {
            toast.error("Kendi hesabınızı silemezsiniz!");
            return;
        }

        if (window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
            try {
                await deleteUser(id);
                toast.success("Kullanıcı başarıyla silindi.");
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                const msg = err.response?.data?.message || "Kullanıcı silinemedi. (Aktif ödünç işlemi olabilir)";
                toast.error(msg);
            }
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            // Backend register endpointine istek atıyoruz
            // Bu endpoint varsayılan olarak USER rolü atar.
            await register(formData);
            toast.success("Yeni üye başarıyla kaydedildi.");
            setIsModalOpen(false);
            setFormData({ username: "", password: "", email: "", name: "" }); // Formu temizle
            loadUsers(); // Listeyi yenile
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Kayıt sırasında bir hata oluştu.";
            toast.error(errorMsg);
        }
    };

    if (loading) {
        return (
            <div className="p-20 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <div className="font-black text-slate-500 uppercase tracking-widest">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-4 animate-in fade-in duration-500">
            {/* BAŞLIK VE EKLEME BUTONU */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Üye Yönetimi</h1>
                    <p className="text-slate-500 mt-2 font-medium">Sistemdeki tüm kayıtlı kütüphane üyelerini yönetin.</p>
                </div>
                {currentUser?.role === "ADMIN" && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        + Yeni Üye Kaydet
                    </button>
                )}
            </div>

            {/* ÜYE EKLEME MODAL (POPUP) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900">Yeni Üye Ekle</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-2xl">×</button>
                        </div>

                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Ad Soyad</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    placeholder="Örn: Ahmet Yılmaz"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Kullanıcı Adı</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    placeholder="kullanici_adi"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">E-posta</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    placeholder="ahmet@mail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Şifre</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-5 py-4 border border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-5 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* KULLANICI TABLOSU */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50/80 text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100">
                            <th className="px-10 py-6">Üye Bilgileri</th>
                            <th className="px-10 py-6">E-posta Adresi</th>
                            <th className="px-10 py-6">Yetki Rolü</th>
                            <th className="px-10 py-6">Kayıt Tarihi</th>
                            <th className="px-10 py-6 text-right">Aksiyon</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-slate-900 font-black text-lg">{user.name}</div>
                                                <div className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">Sistem ID: #{user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="font-medium text-slate-600">{user.email}</div>
                                    </td>
                                    <td className="px-10 py-7">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                                user.role === "ADMIN"
                                                    ? "bg-purple-50 text-purple-700 border-purple-100"
                                                    : "bg-blue-50 text-blue-700 border-blue-100"
                                            }`}>
                                                {user.role}
                                            </span>
                                    </td>
                                    <td className="px-10 py-7 text-slate-500">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : "Belirtilmedi"}
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        {currentUser?.role === "ADMIN" && user.id !== currentUser.userId && (
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="bg-white text-red-500 border border-red-100 hover:bg-red-500 hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-red-200"
                                            >
                                                Kayıdı Sil
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                                    Sistemde henüz kayıtlı kullanıcı bulunmuyor.
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

export default Users;