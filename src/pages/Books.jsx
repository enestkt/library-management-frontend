import { useEffect, useState } from "react";
import { getAllBooks, deleteBook, getBookById, borrowBook } from "../api/api";
import api from "../api/api";
import toast from "react-hot-toast";

function Books() {
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBookId, setEditingBookId] = useState(null);

    // Arama ve Filtreleme State'leri
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Hepsi");

    // Form State
    const [formData, setFormData] = useState({
        isbn: "",
        title: "",
        description: "",
        authorId: "",
        categoryId: "",
        available: true
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
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [booksRes, authorsRes, catsRes] = await Promise.all([
                getAllBooks(),
                api.get("/authors"),
                api.get("/categories")
            ]);
            setBooks(booksRes.data || []);
            setAuthors(authorsRes.data || []);
            setCategoriesList(catsRes.data || []);
        } catch (err) {
            toast.error("Veriler yüklenemedi");
        } finally {
            setLoading(false);
        }
    };

    const handleSelfBorrow = async (bookId) => {
        if (!currentUser?.userId) {
            toast.error("Ödünç almak için giriş yapmalısınız");
            return;
        }
        try {
            await borrowBook(bookId, currentUser.userId);
            toast.success("Kitap üzerinize tanımlandı!");
            fetchInitialData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Ödünç alma başarısız");
        }
    };

    const openModal = async (bookId = null) => {
        if (bookId) {
            setEditingBookId(bookId);
            try {
                const res = await getBookById(bookId);
                const book = res.data;
                setFormData({
                    isbn: book.isbn || "",
                    title: book.title,
                    description: book.description || "",
                    authorId: book.authorId || "",
                    categoryId: book.categoryId || "",
                    available: book.available
                });
            } catch (err) {
                toast.error("Kitap bilgileri alınamadı");
                return;
            }
        } else {
            setEditingBookId(null);
            setFormData({ isbn: "", title: "", description: "", authorId: "", categoryId: "", available: true });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            authorId: Number(formData.authorId),
            categoryId: Number(formData.categoryId)
        };

        try {
            if (editingBookId) {
                await api.put(`/books/${editingBookId}`, payload);
                toast.success("Kitap güncellendi");
            } else {
                await api.post("/books", payload);
                toast.success("Kitap başarıyla eklendi");
            }
            setIsModalOpen(false);
            fetchInitialData();
        } catch (err) {
            toast.error(err.response?.data?.message || "İşlem başarısız");
        }
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryName = book.categoryName || "Genel";
        const matchesCategory = selectedCategory === "Hepsi" || categoryName === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categoriesMenu = ["Hepsi", ...new Set(books.map(b => b.categoryName || "Genel"))];

    if (loading) return <div className="flex items-center justify-center h-screen font-black text-slate-400 animate-pulse uppercase tracking-widest">Yükleniyor...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kitap Arşivi</h1>
                    <p className="text-slate-500 mt-2 font-medium italic">Kütüphane koleksiyonunu keşfedin.</p>
                </div>
                {currentUser?.role === "ADMIN" && (
                    <button
                        onClick={() => openModal()} // Sayfaya gitmek yerine MODAL AÇAR
                        className="px-8 py-4 rounded-[1.5rem] bg-blue-600 text-white font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-xl transition-all active:scale-95"
                    >
                        + Yeni Kitap Ekle
                    </button>
                )}
            </div>

            {/* ARAMA VE FİLTRELEME */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100">
                <input
                    type="text"
                    placeholder="Kitap ismine göre ara..."
                    className="flex-[3] px-8 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-700 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-600 cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categoriesMenu.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* BOOKS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredBooks.map((book) => (
                    <div key={book.id} className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                        <div className="flex gap-6">
                            <div className="w-24 h-36 bg-slate-100 rounded-[1.5rem] flex-shrink-0 overflow-hidden shadow-inner">
                                <img
                                    src={book.imageUrl || `https://picsum.photos/seed/${book.id}/200/300`}
                                    alt={book.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black text-slate-800 text-xl leading-tight mb-2">{book.title}</h3>
                                <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-3 italic">{book.authorName}</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${book.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {book.available ? 'Müsait' : 'Ödünçte'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            {book.available ? (
                                <button
                                    onClick={() => handleSelfBorrow(book.id)}
                                    className="flex-[3] bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                                >
                                    📖 Ödünç Al
                                </button>
                            ) : (
                                <button disabled className="flex-[3] bg-slate-50 text-slate-300 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
                                    Ödünçte
                                </button>
                            )}

                            {currentUser?.role === "ADMIN" && (
                                <>
                                    <button onClick={() => openModal(book.id)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl flex items-center justify-center transition-all">✏️</button>
                                    <button onClick={() => deleteBook(book.id)} className="flex-1 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 py-4 rounded-2xl flex items-center justify-center transition-all">🗑️</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL (SORUNU ÇÖZEN KISIM) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60">
                    <div className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl animate-in zoom-in duration-300">
                        <h2 className="text-3xl font-black text-slate-900 mb-8">{editingBookId ? "Kitabı Güncelle" : "Yeni Kitap Tanımla"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <input
                                placeholder="ISBN Numarası"
                                className="w-full px-8 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-medium"
                                value={formData.isbn}
                                onChange={e => setFormData({...formData, isbn: e.target.value})}
                                required
                            />
                            <input
                                placeholder="Kitap Başlığı"
                                className="w-full px-8 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-medium"
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                required
                            />
                            <select
                                className="w-full px-8 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-600"
                                value={formData.authorId}
                                onChange={e => setFormData({...formData, authorId: e.target.value})}
                                required
                            >
                                <option value="">Yazar Seçiniz</option>
                                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                            <select
                                className="w-full px-8 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-600"
                                value={formData.categoryId}
                                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                                required
                            >
                                <option value="">Kategori Seçiniz</option>
                                {categoriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black uppercase text-xs tracking-widest">İptal</button>
                                <button type="submit" className="flex-1 py-5 bg-blue-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200">Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Books;