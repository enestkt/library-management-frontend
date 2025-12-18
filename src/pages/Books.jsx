import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getBooks, deleteBook } from "../api/api"; //

function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Sayfa yüklendiğinde kitapları getir
    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await getBooks(); //
            setBooks(res.data || []);
        } catch (err) {
            console.error("Kitaplar yüklenirken hata oluştu:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu kitabı silmek istediğinize emin misiniz?")) {
            try {
                await deleteBook(id); //
                fetchBooks(); // Listeyi yenile
            } catch (err) {
                alert("Silme işlemi sırasında bir hata oluştu.");
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
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Kitap Arşivi
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Kütüphanedeki tüm kayıtlı eserler ve durumları
                    </p>
                </div>

                {/* YENİ KİTAP EKLE BUTONU - Link olarak güncellendi */}
                <Link
                    to="/dashboard/books/add"
                    className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    ➕ Yeni Kitap Ekle
                </Link>
            </div>

            {/* BOOKS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {books.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-medium">
                        Henüz kütüphaneye kitap eklenmemiş.
                    </div>
                ) : (
                    books.map((book) => (
                        <div
                            key={book.id}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden"
                        >
                            <div className="flex gap-5">
                                {/* KİTAP GÖRSELİ (Dinamik ve Efektli) */}
                                <div className="w-24 h-32 bg-slate-100 rounded-2xl flex-shrink-0 overflow-hidden relative group">
                                    <img
                                        src={`https://picsum.photos/seed/${book.id}/200/300`}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                </div>

                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-black text-slate-800 text-lg leading-tight line-clamp-2">
                                            {book.title}
                                        </h3>
                                        {/* YAZAR ADI (book.authorName veya book.author.name olarak eşleşir) */}
                                        <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-tight italic">
                                            {book.authorName || book.author?.name || "Bilinmeyen Yazar"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                            book.available
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {book.available ? 'Müsait' : 'Ödünçte'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
                                            {book.categoryName || book.category?.name || "Genel"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* İŞLEM BUTONLARI (Hover durumunda görünür) */}
                            <div className="mt-6 pt-6 border-t border-slate-50 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => navigate(`/dashboard/books/edit/${book.id}`)}
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
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Books;