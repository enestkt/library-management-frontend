import { useEffect, useState } from "react";
import { getBooks, deleteBook, getBookById, api, borrowBook } from "../api/api";
import toast from "react-hot-toast";

function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBookId, setEditingBookId] = useState(null);

    // Arama ve Filtreleme State'leri
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Hepsi");

    // Form State (Admin için)
    const [formData, setFormData] = useState({
        title: "",
        authorId: "",
        categoryId: "",
        available: true
    });

    // Kullanıcı bilgisini ve rolünü alıyoruz
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await getBooks();
            setBooks(res.data || []);
        } catch (err) {
            toast.error("Kitaplar yüklenemedi");
        } finally {
            setLoading(false);
        }
    };

    // --- KENDİ ÜZERİNE ÖDÜNÇ ALMA FONKSİYONU ---
    const handleSelfBorrow = async (bookId) => {
        if (!user.id) {
            toast.error("Ödünç almak için giriş yapmalısınız");
            return;
        }

        try {
            // API dosyasındaki borrowBook'u kullanıyoruz (bookId, userId)
            await borrowBook(bookId, user.id);
            toast.success("Kitap üzerinize tanımlandı!");
            fetchBooks(); // Listeyi güncelle (kitap ödünçte görünecek)
        } catch (err) {
            toast.error(err.response?.data?.message || "Ödünç alma başarısız");
        }
    };

    // Arama ve Kategoriye göre filtreleme mantığı
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryName = book.categoryName || book.category?.name || "Genel";
        const matchesCategory = selectedCategory === "Hepsi" || categoryName === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Mevcut kategorileri dinamik olarak al (Filtre menüsü için)
    const categories = ["Hepsi", ...new Set(books.map(b => b.categoryName || b.category?.name || "Genel"))];

    const openModal = async (bookId = null) => {
        if (bookId) {
            setEditingBookId(bookId);
            try {
                const res = await getBookById(bookId);
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
                await api.put(`/books/${editingBookId}`, formData);
                toast.success("Kitap güncellendi");
            } else {
                await api.post("/books", formData);
                toast.success("Kitap başarıyla eklendi");
            }
            setIsModalOpen(false);
            fetchBooks();
        } catch (err) {
            toast.error("İşlem başarısız: " + (err.response?.data?.message || "Hata oluştu"));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu kitabı silmek istediğinize emin misiniz?")) {
            try {
                await deleteBook(id);
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
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kitap Arşivi</h1>
                    <p className="text-slate-500 mt-1 font-medium">Aradığınız kitabı bulun ve ödünç alın.</p>
                </div>
                {user?.role === "ADMIN" && (
                    <button
                        onClick={() => openModal()}
                        className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
                    >
                        ➕ Yeni Kitap Ekle
                    </button>
                )}
            </div>

            {/* ARAMA VE FİLTRELEME BARI */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="relative flex-1">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 text-xl">🔍</span>
                    <input
                        type="text"
                        placeholder="Kitap ismine göre ara..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-600 cursor-pointer appearance-none"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* BOOKS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredBooks.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-medium">
                        Aradığınız kriterlere uygun kitap bulunamadı.
                    </div>
                ) : (
                    filteredBooks.map((book) => (
                        <div key={book.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative">
                            <div className="flex gap-6">
                                {/* KİTAP GÖRSELİ */}
                                <div className="w-28 h-40 bg-slate-100 rounded-[1.5rem] flex-shrink-0 overflow-hidden relative shadow-inner">
                                    <img
                                        src={`https://picsum.photos/seed/${book.id}/200/300`}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-black text-slate-800 text-xl leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-bold mt-2 uppercase tracking-tight italic opacity-70">
                                            {book.authorName || book.author?.name || "Bilinmeyen Yazar"}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${book.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {book.available ? 'Müsait' : 'Ödünçte'}
                                        </span>
                                        <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                                            {book.categoryName || book.category?.name || "Genel"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ALT BUTONLAR */}
                            <div className="mt-6 flex gap-3">
                                {book.available ? (
                                    <button
                                        onClick={() => handleSelfBorrow(book.id)}
                                        className="flex-[2] bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all active:scale-95 shadow-lg shadow-slate-200"
                                    >
                                        📖 Ödünç Al
                                    </button>
                                ) : (
                                    <button disabled className="flex-[2] bg-slate-100 text-slate-400 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] cursor-not-allowed">
                                        ❌ Şu An Ödünçte
                                    </button>
                                )}

                                {user?.role === "ADMIN" && (
                                    <div className="flex flex-1 gap-2">
                                        <button
                                            onClick={() => openModal(book.id)}
                                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl flex items-center justify-center transition-all"
                                            title="Düzenle"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            className="flex-1 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 py-4 rounded-2xl flex items-center justify-center transition-all"
                                            title="Sil"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* MODAL (Admin Formu) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 border border-white/20">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">
                            {editingBookId ? "Kitabı Düzenle" : "Yeni Kitap Ekle"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Kitap Başlığı</label>
                                <input
                                    className="w-full px-6 py-4 bg-slate-100 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-medium mt-2 transition-all"
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
                                        className="w-full px-6 py-4 bg-slate-100 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-medium mt-2"
                                        value={formData.authorId}
                                        onChange={e => setFormData({...formData, authorId: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Kategori ID</label>
                                    <input
                                        type="number"
                                        className="w-full px-6 py-4 bg-slate-100 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-medium mt-2"
                                        value={formData.categoryId}
                                        onChange={e => setFormData({...formData, categoryId: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition">İptal</button>
                                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-200">Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Books;