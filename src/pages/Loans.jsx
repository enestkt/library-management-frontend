import { useEffect, useState } from "react";
import {
    getAllLoans,
    returnBook,
    borrowBook,
    getAllUsers,
    getAllBooks
} from "../api/api";
import toast from "react-hot-toast";

function Loans() {
    const [loans, setLoans] = useState([]);
    const [users, setUsers] = useState([]);
    const [availableBooks, setAvailableBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [borrowForm, setBorrowForm] = useState({ userId: "", bookId: "" });
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [loansRes, usersRes, booksRes] = await Promise.all([
                getAllLoans(),
                getAllUsers(),
                getAllBooks()
            ]);

            setLoans(loansRes.data || []);
            setUsers(usersRes.data || []);

            const allBooks = booksRes.data || [];
            setAvailableBooks(allBooks.filter(b => b.available === true));
        } catch (err) {
            console.error("Veri yükleme hatası:", err);
            toast.error("Veriler yüklenemedi.");
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
            await borrowBook(
                Number(borrowForm.bookId),
                Number(borrowForm.userId)
            );

            toast.success("Kitap başarıyla ödünç verildi!");
            setBorrowForm({ userId: "", bookId: "" });
            await loadInitialData();
        } catch (err) {
            toast.error("Ödünç verme işlemi başarısız.");
        }
    };

    const handleReturn = async (loanId) => {
        if (!window.confirm("Bu kitap iade alındı olarak işaretlensin mi?")) return;

        try {
            await returnBook(loanId);
            toast.success("Kitap başarıyla iade alındı.");
            await loadInitialData();
        } catch {
            toast.error("İade işlemi sırasında hata oluştu.");
        }
    };

    if (loading) {
        return (
            <div className="p-20 text-center font-black animate-pulse uppercase tracking-widest text-slate-400">
                Yükleniyor...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-4">

            {/* ÖDÜNÇ VERME PANELİ */}
            {currentUser?.role === "ADMIN" && (
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
                    <h3 className="text-2xl font-bold mb-8">⚡ Yeni Ödünç İşlemi</h3>

                    <form
                        onSubmit={handleBorrowSubmit}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <select
                            className="rounded-2xl p-5 text-slate-900"
                            value={borrowForm.userId}
                            onChange={e => setBorrowForm({ ...borrowForm, userId: e.target.value })}
                        >
                            <option value="">Üye Seç</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.name} (ID: {u.id})
                                </option>
                            ))}
                        </select>

                        <select
                            className="rounded-2xl p-5 text-slate-900"
                            value={borrowForm.bookId}
                            onChange={e => setBorrowForm({ ...borrowForm, bookId: e.target.value })}
                        >
                            <option value="">Müsait Kitap Seç</option>
                            {availableBooks.map(b => (
                                <option key={b.id} value={b.id}>
                                    {b.title}
                                </option>
                            ))}
                        </select>

                        <button className="bg-blue-600 hover:bg-blue-500 rounded-2xl font-black">
                            Kitabı Teslim Et
                        </button>
                    </form>
                </div>
            )}

            {/* LOANS TABLOSU */}
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 text-slate-400 text-xs uppercase">
                    <tr>
                        <th className="px-10 py-6">Üye</th>
                        <th className="px-10 py-6">Kitap</th>
                        <th className="px-10 py-6">Tarih</th>
                        <th className="px-10 py-6">Durum</th>
                        <th className="px-10 py-6 text-right">İşlem</th>
                    </tr>
                    </thead>

                    <tbody>
                    {loans.map(loan => (
                        <tr key={loan.id} className="border-b">
                            <td className="px-10 py-7 font-bold">
                                {loan.user?.name}
                            </td>

                            <td className="px-10 py-7">
                                {loan.book?.title}
                            </td>

                            <td className="px-10 py-7">
                                {new Date(
                                    loan.borrowDate || loan.loanDate
                                ).toLocaleDateString("tr-TR")}
                            </td>

                            <td className="px-10 py-7">
                                    <span className={`px-4 py-1 rounded-full text-xs font-black ${
                                        loan.status === "BORROWED"
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-emerald-100 text-emerald-700"
                                    }`}>
                                        {loan.status === "BORROWED" ? "Ödünçte" : "İade Edildi"}
                                    </span>
                            </td>

                            <td className="px-10 py-7 text-right">
                                {loan.status === "BORROWED" && currentUser?.role === "ADMIN" && (
                                    <button
                                        onClick={() => handleReturn(loan.id)}
                                        className="text-red-600 font-black hover:underline"
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
