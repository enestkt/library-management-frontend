import { useEffect, useState } from "react";
import { getAllLoans, returnBook, borrowBook, getAllUsers, getAllBooks } from "../api/api";
import toast from "react-hot-toast";

function Loans() {
    const [loans, setLoans] = useState([]);
    const [users, setUsers] = useState([]);
    const [availableBooks, setAvailableBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [borrowForm, setBorrowForm] = useState({ userId: "", bookId: "" });

    // LocalStorage'dan kullanıcı bilgisini al
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            // İsimlendirmeler api.js ile senkronize edildi
            const [loansRes, usersRes, booksRes] = await Promise.all([
                getAllLoans(),
                getAllUsers(),
                getAllBooks()
            ]);

            setLoans(loansRes.data || []);
            setUsers(usersRes.data || []);

            // Sadece müsait olan (available: true) kitapları filtrele
            const books = booksRes.data || [];
            setAvailableBooks(books.filter(b => b.available === true));
        } catch (err) {
            console.error("Veri yükleme hatası:", err);
            toast.error("Veriler yüklenemedi. Sunucu bağlantısını kontrol edin.");
        } finally {
            setLoading(false);
        }
    };

    const handleBorrowSubmit = async (e) => {
        e.preventDefault();

        if (!borrowForm.userId || !borrowForm.bookId) {
            toast.error("Lütfen bir üye ve bir kitap seçin");
            return;
        }

        try {
            // api.js'deki borrowBook fonksiyonuna parametreleri gönderiyoruz
            await borrowBook(borrowForm.bookId, borrowForm.userId);
            toast.success("Kitap başarıyla teslim edildi!");

            // Formu sıfırla ve listeyi yenile
            setBorrowForm({ userId: "", bookId: "" });
            await loadInitialData();
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Ödünç verme işlemi başarısız.";
            toast.error(errorMsg);
        }
    };

    const handleReturn = async (loanId) => {
        if (window.confirm("Bu kitap iade alındı olarak işaretlensin mi?")) {
            try {
                await returnBook(loanId);
                toast.success("Kitap başarıyla iade alındı.");
                await loadInitialData();
            } catch (err) {
                toast.error("İade işlemi sırasında bir hata oluştu.");
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
            {/* BAŞLIK BÖLÜMÜ */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ödünç Yönetimi</h1>
                    <p className="text-slate-500 mt-2 font-medium">Kütüphane sirkülasyonunu buradan yönetebilirsiniz.</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                    <span className="text-blue-700 font-bold text-sm">Aktif Ödünç Sayısı: {loans.filter(l => l.status === "BORROWED").length}</span>
                </div>
            </div>

            {/* ADMIN HIZLI İŞLEM PANELİ */}
            {currentUser?.role === "ADMIN" && (
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32"></div>

                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <span className="bg-blue-600 p-2 rounded-xl text-xl">⚡</span> Yeni Ödünç İşlemi
                        </h3>

                        <form onSubmit={handleBorrowSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* ÜYE SEÇİMİ */}
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Teslim Alacak Üye</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer hover:bg-white/10"
                                    value={borrowForm.userId}
                                    onChange={(e) => setBorrowForm({...borrowForm, userId: e.target.value})}
                                    required
                                >
                                    <option value="" className="text-slate-900">Üye seçiniz...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id} className="text-slate-900">
                                            {u.name} (ID: {u.id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* KİTAP SEÇİMİ */}
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Ödünç Verilecek Kitap</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer hover:bg-white/10"
                                    value={borrowForm.bookId}
                                    onChange={(e) => setBorrowForm({...borrowForm, bookId: e.target.value})}
                                    required
                                >
                                    <option value="" className="text-slate-900">Kitap seçiniz...</option>
                                    {availableBooks.length > 0 ? (
                                        availableBooks.map(b => (
                                            <option key={b.id} value={b.id} className="text-slate-900">{b.title}</option>
                                        ))
                                    ) : (
                                        <option disabled className="text-slate-900">Müsait kitap yok</option>
                                    )}
                                </select>
                            </div>

                            {/* ONAY BUTONU */}
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] active:scale-95"
                                >
                                    İşlemi Onayla ve Teslim Et
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TABLO LİSTESİ */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50/80 text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100">
                            <th className="px-10 py-6">Üye & Durum</th>
                            <th className="px-10 py-6">Emanet Kitap</th>
                            <th className="px-10 py-6">Tarih Bilgisi</th>
                            <th className="px-10 py-6">Durum</th>
                            <th className="px-10 py-6 text-right">Aksiyon</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {loans.length > 0 ? (
                            loans.map((loan) => (
                                <tr key={loan.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-10 py-7">
                                        <div className="text-slate-900 font-black text-lg">{loan.userName || "İsimsiz Kullanıcı"}</div>
                                        <div className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">Sistem Kaydı: #{loan.id}</div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="font-bold text-slate-700 text-base">{loan.bookTitle}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">Kitap ID: {loan.bookId}</div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="text-slate-600 font-bold">{new Date(loan.loanDate).toLocaleDateString('tr-TR')}</div>
                                        <div className="text-[10px] text-slate-400">Veriliş Tarihi</div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            loan.status === "BORROWED"
                                                ? "bg-orange-100 text-orange-700 border border-orange-200"
                                                : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        }`}>
                                            {loan.status === "BORROWED" ? "● Ödünçte" : "✓ İade Edildi"}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        {loan.status === "BORROWED" && currentUser?.role === "ADMIN" && (
                                            <button
                                                onClick={() => handleReturn(loan.id)}
                                                className="bg-white text-red-600 border border-red-100 hover:bg-red-600 hover:text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-red-200"
                                            >
                                                İade Al
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                                    Henüz ödünç kaydı bulunmuyor.
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

export default Loans;