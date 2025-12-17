import axios from "axios";

/**
 * BASE CONFIG
 * * process.env.REACT_APP_API_URL:
 * - Lokaldeyken: undefined (veya .env dosyasında varsa o) -> "http://localhost:8080/api" kullanılır.
 * - Canlıda (Vercel): Vercel ayarlarında girdiğimiz link kullanılır.
 */
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
});

// ===== 1. TOKEN INTERCEPTOR (İstek Atarken) =====
// Her isteğe otomatik olarak localStorage'daki token'ı ekler.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ===== 2. ERROR INTERCEPTOR (Cevap Gelirken) =====
// Backend'den hata dönerse (400, 401, 500 vs.) yakalar ve ekrana basar.
api.interceptors.response.use(
    (response) => response, // Başarılıysa dokunma, devam et.
    (error) => {
        // Backend'den gönderdiğimiz özel JSON mesajını yakalamaya çalışıyoruz
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.details ||
            error.response?.data?.error ||
            "Beklenmedik bir hata oluştu!";

        // Ekrana 'Alert' kutusu olarak çıkar (Kullanıcı hatayı görsün)
        // Not: 401 (Yetkisiz) hatasında alert çıkarmak yerine login'e de atabilirsin ama şimdilik alert kalsın.
        if (error.response && error.response.status !== 401) {
            alert("⚠️ HATA: " + errorMessage);
        }

        return Promise.reject(error);
    }
);

/* =======================
        AUTH
======================= */

// LOGIN
export const loginRequest = (email, password) => {
    return api.post("/auth/login", { email, password });
};

// REGISTER
export const registerRequest = (name, email, password) => {
    return api.post("/auth/register", {
        name,
        email,
        password,
    });
};

/* =======================
        BOOK
======================= */

export const getBooks = () => api.get("/books");

// ID'ye göre kitap getir (Detay sayfası için gerekebilir)
export const getBookById = (id) => api.get(`/books/${id}`);

export const deleteBook = (id) =>
    api.delete(`/books/${id}`);

/* =======================
        LOAN
======================= */

export const borrowBook = (bookId, userId) =>
    api.post(`/loans/borrow/${bookId}/${userId}`);

export const returnBook = (loanId) =>
    api.post(`/loans/return/${loanId}`);

export const getUserLoans = (userId) =>
    api.get(`/loans/user/${userId}`);

/* =======================
        USERS / DASHBOARD
======================= */

export const getAllUsers = () =>
    api.get("/users");

export const getAllLoans = () =>
    api.get("/loans");

export default api;