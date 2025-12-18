import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

function Profile() {
    const [myLoans, setMyLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    // LocalStorage'dan giriş yapan kullanıcının bilgilerini alıyoruz
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
        fetchMyLoans();
    }, []);

    const fetchMyLoans = async () => {
        try {
            // Backend'deki /api/loans/user/{id} rotasını çağırıyoruz
            const res = await api.get(`/loans/user/${user.id}`);
            // Sadece henüz iade edilmemiş (returnDate null olan) kitapları filtrele
            const activeLoans = (res.data || []).filter(loan => !loan.returnDate);
            setMyLoans(activeLoans);
        } catch (err) {
            toast.error("Kitap bilgileriniz yüklenemedi");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-500 animate-pulse">Profil yükleniyor...</div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-10">
            {/* KULLANICI BİLGİ KARTI */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    {/* Profil Avatarı */}
                    <div className="w-32 h-32 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-inner border-4 border-white/10">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-4xl font-black tracking-tight">{user.name}</h1>
                        <p className="text-slate-400 font-medium text-lg">{user.email}</p>
                        <div className="flex gap-3 pt-2 justify-center md:justify-start">
                            <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                                Rol: {user.role}
                            </span>
                            <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/10">
                                Aktif Kitap: {myLoans.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Dekoratif Arka Plan Elemanları */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
            </div>

            {/* ÜZERİNDEKİ KİTAPLAR BÖLÜMÜ */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight text-white">Şu An Sizde Olanlar</h2>
                    <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">{myLoans.length} KİTAP</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myLoans.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-medium">
                            Üzerinizde ödünç alınmış bir kitap bulunmuyor. <br />
                            <a href="/dashboard/books" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Kitaplara göz atın →</a>
                        </div>
                    ) : (
                        myLoans.map((loan) => (
                            <div key={loan.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-xl transition-all group">
                                <div className="w-20 h-28 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300">
                                    📖
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-slate-800 text-xl leading-tight">{loan.bookTitle}</h3>
                                    <div className="mt-3 space-y-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            📅 Alınış: <span className="text-slate-600">{new Date(loan.loanDate).toLocaleDateString('tr-TR')}</span>
                                        </p>
                                        <div className="pt-3">
                                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                İade Bekleniyor
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;