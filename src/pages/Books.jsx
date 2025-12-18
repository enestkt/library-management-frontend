import { useEffect, useState } from "react";
import { getBooks, deleteBook, getBookById, api } from "../api/api"; //
import toast from "react-hot-toast";

function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBookId, setEditingBookId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        authorId: "",
        categoryId: "",
        available: true
    });

    // Kullanıcı bilgisini ve rolünü alıyoruz
    const user = JSON.parse(localStorage.getItem("user") || "{}"); //

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await getBooks(); //
            setBooks(res.data || []);
        } catch (err) {
            toast.error("Kitaplar yüklenemedi");
        } finally {
            setLoading(false);
        }
    };

    const openModal = async (bookId = null) => {
        if (bookId) {
            setEditingBookId(bookId);
            try {
                const res = await getBookById(bookId); //
                setFormData({
                    title: res.data.title,
                    authorId: res.data.authorId || "",
                    categoryId: res.data.categoryId || "",
                    available: res.data.available
                });
            } catch (err) {
                toast.error("Kitap bilgileri alınamadı");
                return;
            }
        } else {
            setEditingBookId(null);
            setFormData({ title: "", authorId: "", categoryId: "", available: true });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBookId) {
                await api.put(`/books/${editingBookId}`, formData); //
                toast.success("Kitap güncellendi");
            } else {
                await api.post("/books", formData); //
                toast.success("Kitap başarıyla eklendi");
            }
            setIsModalOpen(false);
            fetchBooks(); // Listeyi database'den yenile
        } catch (err) {
            toast.error("İşlem başarısız: " + (err.response?.data?.message || "Hata oluştu"));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu kitabı silmek istediğinize emin misiniz?")) {
            try {
                await deleteBook(id); //
                toast.success("Kitap silindi");
                fetchBooks();
            } catch (err) {
                toast.error("Silme yetkiniz olmayabilir veya bir hata oluştu");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-slate-500 font-medium animate-pulse">
                Kitap arşivi yükleniyor...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kitap Arşivi</h1>
                    <p className="text-slate-500 mt-1 font-medium">Koleksiyonu buradan yönetebilirsiniz.</p>
                </div>
                {/* Sadece ADMIN kitap ekleyebilir */}
                {user?.role === "ADMIN" && (
                    <button
                        onClick={() => openModal()}
                        className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        ➕ Yeni Kitap Ekle
                    </button>
                )}
            </div>

            {/* BOOKS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {books.map((book) => (
                    <div key={book.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="flex gap-5">
                            <div className="w-24 h-32 bg-slate-100 rounded-2xl flex-shrink-0 overflow-hidden relative group">
                                <img
                                    src={`https://picsum.photos/seed/${book.id}/200/300`}
                                    alt={book.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-black text-slate-800 text-lg leading-tight line-clamp-2">{book.title}</h3>
                                    <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-tight italic">
                                        {book.authorName || book.author?.name || "Bilinmeyen Yazar"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${book.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {book.available ? 'Müsait' : 'Ödünçte'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* İşlem Butonları - Sadece ADMIN için görünür */}
                        {user?.role === "ADMIN" && (
                            <div className="mt-6 pt-6 border-t border-slate-50 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openModal(book.id)}
                                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition"
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleDelete(book.id)}
                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition"
                                >
                                    Sil
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* MODAL (Açılır Pencere Formu) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">
                            {editingBookId ? "Kitabı Düzenle" : "Yeni Kitap Ekle"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Kitap Başlığı</label>
                                <input
                                    className="w-full px-5 py-4 bg-slate-100 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-medium mt-1 transition-all"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="Örn: Nutuk"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Yazar ID</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-4 bg-slate-100 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-medium mt-1"
                                        value={formData.authorId}
                                        onChange={e => setFormData({...formData, authorId: e.target.value})}
                                        placeholder="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Kategori ID</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-4 bg-slate-100 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-medium mt-1"
                                        value={formData.categoryId}
                                        onChange={e => setFormData({...formData, categoryId: e.target.value})}
                                        placeholder="1"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-200"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Books;