import api from "./api"; // Kendi axios instance'ın

// KULLANICI LİSTESİ
export const getAllUsers = () => api.get("/users");

// KİTAP LİSTESİ
export const getAllBooks = () => api.get("/books");

// ÖDÜNÇ LİSTESİ (TÜMÜ)
export const getAllLoans = () => api.get("/loans");

// KİTAP ÖDÜNÇ AL
// Backend @RequestBody (JSON) beklediği için veriyi nesne olarak gönderiyoruz
export const borrowBook = (bookId, userId) => {
    return api.post("/loans/borrow", {
        bookId: bookId,
        userId: userId
    });
};

// KİTAP İADE ET
export const returnBook = (loanId) => {
    return api.post(`/loans/return/${loanId}`);
};

// KULLANICI ÖDÜNÇ GEÇMİŞİ
export const getUserLoans = (userId) => {
    return api.get(`/loans/user/${userId}`);
};