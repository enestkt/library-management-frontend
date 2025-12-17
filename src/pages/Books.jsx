import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../api/api"; // Merkezi API yapılandırması
import axios from "axios";
import "../styles/pages.css"; //
import "../styles/books.css"; //

export default function Books() {
    const [books, setBooks] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // Arama özelliği için

    // Yeni kitap state'i (Admin ekleme formu için)
    const [newBook, setNewBook] = useState({
        title: "",
        authorName: "",
        categoryName: "",
        isbn: "",
        description: "",
        imageUrl: ""
    });

    // Kitapları API'den çekme fonksiyonu
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await getBooks();
            setBooks(res.data || []);
        } catch (err) {
            console.error("Kitaplar yüklenirken hata oluştu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Yeni Kitap Ekleme (POST) İşlemi
    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token"); //
            const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

            await axios.post(`${apiUrl}/books`, newBook, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("✅ Kitap başarıyla kütüphaneye eklendi!");
            setShowAddForm(false);
            setNewBook({ title: "", authorName: "", categoryName: "", isbn: "", description: "", imageUrl: "" });
            fetchBooks(); // Listeyi yenile
        } catch (err) {
            alert("❌ Hata: " + (err.response?.data?.message || "Kitap eklenemedi. Yetkinizi kontrol edin."));
        }
    };

    // Kitap Silme (DELETE) İşlemi
    const handleDelete = async (id) => {
        if (window.confirm("Bu kitabı silmek istediğinize emin misiniz?")) {
            try {
                await deleteBook(id);
                fetchBooks(); // Listeyi yenile
            } catch (err) {
                alert("❌ Silme işlemi başarısız.");
            }
        }
    };

    // Arama filtrelemesi (Hem yazar hem kitap ismine göre)
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page">
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                    <h1>Kitap Envanteri</h1>
                    <p>Kütüphanedeki tüm kitapları yönetin ve yeni kayıt oluşturun.</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    {/* Arama Çubuğu */}
                    <input
                        type="text"
                        placeholder="Kitap veya yazar ara..."
                        className="form-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", width: "220px" }}
                    />
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className={showAddForm ? "btn-dark" : "btn-primary"}
                        style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer", border: "none" }}
                    >
                        {showAddForm ? "✖ İptal Et" : "+ Yeni Kitap Ekle"}
                    </button>
                </div>
            </div>

            {/* --- YENİ KİTAP EKLEME FORMU --- */}
            {showAddForm && (
                <div className="card" style={{ marginBottom: "30px", border: "2px solid #3b82f6", padding: "20px" }}>
                    <h3 style={{ marginBottom: "20px" }}>📖 Yeni Kitap Kaydı</h3>
                    <form onSubmit={handleAddBook} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                        <input
                            type="text" required placeholder="Kitap Adı" className="form-input"
                            value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})}
                        />
                        <input
                            type="text" required placeholder="Yazar" className="form-input"
                            value={newBook.authorName} onChange={e => setNewBook({...newBook, authorName: e.target.value})}
                        />
                        <input
                            type="text" required placeholder="Kategori" className="form-input"
                            value={newBook.categoryName} onChange={e => setNewBook({...newBook, categoryName: e.target.value})}
                        />
                        <input
                            type="text" placeholder="Görsel URL (Opsiyonel)" className="form-input"
                            value={newBook.imageUrl} onChange={e => setNewBook({...newBook, imageUrl: e.target.value})}
                        />
                        <textarea
                            placeholder="Kitap Açıklaması" rows="2" className="form-input" style={{ gridColumn: "span 2" }}
                            value={newBook.description} onChange={e => setNewBook({...newBook, description: e.target.value})}
                        ></textarea>
                        <button type="submit" className="btn-primary" style={{ gridColumn: "span 2", padding: "12px", fontWeight: "bold" }}>
                            Sisteme Kaydet
                        </button>
                    </form>
                </div>
            )}

            {/* --- KİTAP LİSTESİ (GRID) --- */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "50px" }}>🔄 Kitaplar yükleniyor...</div>
            ) : (
                <div className="book-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                    {filteredBooks.length > 0 ? filteredBooks.map((book) => (
                        <div key={book.id} className="book-card" style={{ border: "1px solid #eee", borderRadius: "10px", overflow: "hidden", background: "#fff" }}>
                            <img
                                src={book.imageUrl || "https://images.unsplash.com/photo-1543004408-6534603a6bcb?q=80&w=1974&auto=format&fit=crop"}
                                alt={book.title}
                                style={{ width: "100%", height: "220px", objectFit: "cover" }}
                            />
                            <div className="book-info" style={{ padding: "15px" }}>
                                <h4 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>{book.title}</h4>
                                <p style={{ fontSize: "13px", color: "#666", marginBottom: "10px" }}>{book.authorName}</p>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span className={`badge ${book.available ? "ok" : "warn"}`}>
                                        {book.available ? "Mevcut" : "Ödünçte"}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(book.id)}
                                        style={{ backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: "span 4", textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                            Aranan kriterlere uygun kitap bulunamadı.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}