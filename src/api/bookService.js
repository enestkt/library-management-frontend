import api from "./api";

// tüm kitapları getir
export const getAllBooks = () => {
    return api.get("/books");  // Önceden "/api/books" idi
};

// kitap sil
export const deleteBook = (id) => {
    return api.delete(`/books/${id}`); // Önceden "/api/books/..." idi
};