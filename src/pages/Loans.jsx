import { useEffect, useState } from "react";
import { getAllLoans, returnBook } from "../api/api";

function Loans() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const res = await getAllLoans();
            setLoans(res.data || []);
        } catch (err) {
            console.error("Ödünç listesi yüklenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (id) => {
        if (window.confirm("Bu kitap teslim edildi olarak işaretlensin mi?")) {
            try {
                await returnBook(id);
                fetchLoans(); // Listeyi yenile
            } catch (err) {
                alert("İade işlemi başarısız!");
            }
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-500 animate-pulse">İşlemler yükleniyor...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ödünç Takibi</h1>
                <p className="text-slate-500 mt-1 font-medium">Kütüphane sirkülasyonunu buradan izleyebilirsiniz.</p>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-widest text-[11px] border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5">Kitap</th>
                            <th className="px-8 py-5">Kullanıcı</th>
                            <th className="px-8 py-5">Tarih</th>
                            <th className="px-8 py-5">Durum</th>
                            <th className="px-8 py-5 text-right">İşlem</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {loans.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-20 text-center text-slate-400 font-medium italic">Aktif işlem bulunamadı.</td>
                            </tr>
                        ) : (
                            loans.map((loan) => (
                                <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5 font-bold text-slate-800">{loan.bookTitle}</td>
                                    <td className="px-8 py-5 text-slate-600 font-medium">
                                        {loan.userName || "İsimsiz Kullanıcı"}
                                        <span className="block text-[10px] text-slate-400 font-normal">ID: {loan.userId}</span>
                                    </td>
                                    <td className="px-8 py-5 text-slate-500">{loan.loanDate}</td>
                                    <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                loan.status === "BORROWED"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-emerald-100 text-emerald-700"
                                            }`}>
                                                {loan.status === "BORROWED" ? "Ödünçte" : "Teslim Edildi"}
                                            </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {loan.status === "BORROWED" && (
                                            <button
                                                onClick={() => handleReturn(loan.id)}
                                                className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tighter transition-all"
                                            >
                                                İade Al
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Loans;