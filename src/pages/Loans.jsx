import { useEffect, useState } from "react";
import { getAllLoans, returnBook, borrowBook, getAllUsers, getBooks } from "../api/api"; //
import toast from "react-hot-toast";

function Loans() {
    const [loans, setLoans] = useState([]);
    const [users, setUsers] = useState([]);
    const [availableBooks, setAvailableBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Ödünç Verme Form State (ID yerine Seçim)
    const [borrowForm, setBorrowForm] = useState({ userId: "", bookId: "" });

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}"); //

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [loansRes, usersRes, booksRes] = await Promise.all([
                getAllLoans(),
                getAllUsers(),
                getBooks()
            ]); //

            setLoans(loansRes.data || []);
            setUsers(usersRes.data || []);
            // Sadece müsait olan kitapları ödünç verme listesine alıyoruz
            setAvailableBooks((booksRes.data || []).filter(b => b.available)); //
        } catch (err) {
            toast.error("Veriler yüklenemedi");
        } finally {
            setLoading(false);
        }
    };

    const handleBorrowSubmit = async (e) => {
        e.preventDefault();
        if (!borrowForm.userId || !borrowForm.bookId) {
            toast.error("Lütfen kullanıcı ve kitap seçin");
            return;
        }

        try {
            await borrowBook(borrowForm.bookId, borrowForm.userId); //
            toast.success("Kitap başarıyla ödünç verildi!");
            setBorrowForm({ userId: "", bookId: "" });
            loadInitialData(); // Listeleri ve müsait kitapları yenile
        } catch (err) {
            toast.error(err.response?.data?.message || "İşlem başarısız");
        }
    };

    const handleReturn = async (id) => {
        if (window.confirm("Bu kitap teslim edildi olarak işaretlensin mi?")) {
            try {
                await returnBook(id); //
                toast.success("Kitap teslim alındı");
                loadInitialData();
            } catch (err) {
                toast.error("İade işlemi başarısız!");
            }
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-500 animate-pulse">Yükleniyor...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ödünç Yönetimi</h1>
                <p className="text-slate-500 mt-1 font-medium">Kitapları üyelere atayın veya iade alın.</p>
            </div>

            {/* AKILLI ÖDÜNÇ VERME FORMU (Seçim Kutulu) */}
            {currentUser?.role === "ADMIN" && (
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="text-2xl">⚡</span> Hızlı Ödünç İşlemi
                        </h3>
                        <form onSubmit={handleBorrowSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Kullanıcı Seçimi */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Üye Seçin</label>
                                <select
                                    className="w-full bg-white/10 border-none rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                    value={borrowForm.userId}
                                    onChange={(e) => setBorrowForm({...borrowForm, userId: e.target.value})}
                                    required
                                >
                                    <option value="" className="text-slate-900">Üye seçiniz...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id} className="text-slate-900">{u.name} ({u.email})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Kitap Seçimi */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Müsait Kitaplar</label>
                                <select
                                    className="w-full bg-white/10 border-none rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                    value={borrowForm.bookId}
                                    onChange={(e) => setBorrowForm({...borrowForm, bookId: e.target.value})}
                                    required
                                >
                                    <option value="" className="text-slate-900">Kitap seçiniz...</option>
                                    {availableBooks.map(b => (
                                        <option key={b.id} value={b.id} className="text-slate-900">{b.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-lg"
                                >
                                    Kitabı Teslim Et
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* AKTİF ÖDÜNÇLER LİSTESİ */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-widest text-[11px] border-b">
                    <tr>
                        <th className="px-8 py-5">Üye (Kitap Kimde?)</th>
                        <th className="px-8 py-5">Emanet Edilen Kitap</th>
                        <th className="px-8 py-5">Veriliş Tarihi</th>
                        <th className="px-8 py-5">Durum</th>
                        <th className="px-8 py-5 text-right">İşlem</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {loans.map((loan) => (
                        <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5">
                                <div className="text-slate-800 font-bold text-base">{loan.userName || "İsimsiz"}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic">Üye ID: #{loan.userId}</div>
                            </td>
                            <td className="px-8 py-5">
                                <div className="font-bold text-slate-700 underline underline-offset-4 decoration-blue-100">{loan.bookTitle}</div>
                            </td>
                            <td className="px-8 py-5 text-slate-500 font-medium">
                                {new Date(loan.loanDate).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                        loan.status === "BORROWED" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                                    }`}>
                                        {loan.status === "BORROWED" ? "Ödünçte" : "Teslim Edildi"}
                                    </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                                {loan.status === "BORROWED" && currentUser?.role === "ADMIN" && (
                                    <button
                                        onClick={() => handleReturn(loan.id)}
                                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                                    >
                                        İade Al
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Loans;