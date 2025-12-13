import api from "./api";

// KİTAP ÖDÜNÇ AL (Düzeltilen Kısım)
// Backend @RequestBody istediği için veriyi {} içinde gönderiyoruz.
export const borrowBook = (bookId, userId) => {
    return api.post("/loans/borrow", {
        bookId: bookId,
        userId: userId
    });
};

// KİTAP İADE ET (Bu kısım zaten doğruydu, path variable kullanıyor)
export const returnBook = (loanId) => {
    return api.post(`/loans/return/${loanId}`);
};

// KULLANICI GEÇMİŞİ
export const getUserLoans = (userId) => {
    return api.get(`/loans/user/${userId}`);
};

// TÜM KULLANICILAR
export const getAllUsers = () =>
    api.get("/users");

// TÜM KİTAPLAR
export const getAllBooks = () =>
    api.get("/books");

// TÜM ÖDÜNÇLER
export const getAllLoans = () =>
    api.get("/loans");