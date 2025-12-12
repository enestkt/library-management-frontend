import api from "./api";

// tüm kitapları getir
export const getAllBooks = () => {
    return api.get("/api/books");
};

// kitap sil
export const deleteBook = (id) => {
    return api.delete(`/api/books/${id}`);
};
