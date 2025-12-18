import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../api/api";
import toast from "react-hot-toast";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Giriş yapan kullanıcının rolünü kontrol etmek için
    let user = null;

    try {
        const rawUser = localStorage.getItem("user");
        user = rawUser && rawUser !== "undefined"
            ? JSON.parse(rawUser)
            : null;
    } catch (e) {
        user = null;
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

    // --- SİLME İŞLEMİ (EKLENEN KISIM) ---
    const handleDelete = async (id) => {
        // Admin'in kendini silmesini engellemek için küçük bir güvenlik kontrolü
        if (id === currentUser.userId) {
            toast.error("Kendi hesabınızı silemezsiniz!");
            return;
        }

        if (window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
            try {
                await deleteUser(id);
                toast.success("Kullanıcı başarıyla silindi.");
                // Listeyi sayfayı yenilemeden güncelle
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                // Eğer kullanıcının iade etmediği kitap varsa backend hata dönecektir
                const msg = err.response?.data?.message || "Kullanıcı silinemedi. (Aktif ödünç işlemi olabilir)";
                toast.error(msg);
            }
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
            {/* BAŞLIK */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Üye Yönetimi</h1>
                <p className="text-slate-500 mt-2 font-medium">Sistemdeki tüm kayıtlı kütüphane üyelerini yönetin.</p>
            </div>

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
                                        {/* Sadece ADMIN'ler silme işlemi yapabilir ve kendini silemez */}
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