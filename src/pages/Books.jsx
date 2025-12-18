import { useEffect, useState } from "react";

function Books() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // fetchBooks();
    }, []);

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">
                        Books
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Kütüphanedeki tüm kitaplar
                    </p>
                </div>

                <button className="px-5 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition">
                    ➕ Yeni Kitap
                </button>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-2xl shadow p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b text-slate-500">
                        <tr>
                            <th className="text-left py-3">Başlık</th>
                            <th className="text-left py-3">Yazar</th>
                            <th className="text-left py-3">Durum</th>
                            <th className="text-right py-3">İşlemler</th>
                        </tr>
                        </thead>

                        <tbody>
                        {books.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="py-10 text-center text-slate-400"
                                >
                                    Henüz kitap yok
                                </td>
                            </tr>
                        ) : (
                            books.map((book) => (
                                <tr
                                    key={book.id}
                                    className="border-b last:border-0 hover:bg-slate-50 transition"
                                >
                                    <td className="py-3 font-medium">
                                        {book.title}
                                    </td>
                                    <td className="py-3">
                                        {book.author}
                                    </td>
                                    <td className="py-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                Müsait
                                            </span>
                                    </td>
                                    <td className="py-3 text-right space-x-2">
                                        <button className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition font-semibold">
                                            Düzenle
                                        </button>
                                        <button className="px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition font-semibold">
                                            Sil
                                        </button>
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

export default Books;
