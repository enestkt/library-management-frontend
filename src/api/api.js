import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
});

// TOKEN INTERCEPTOR
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ERROR INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.details ||
            error.response?.data?.error ||
            "Beklenmedik bir hata oluştu!";

        if (error.response && error.response.status !== 401) {
            alert("⚠️ HATA: " + errorMessage);
        }
        return Promise.reject(error);
    }
);

/* AUTH İŞLEMLERİ */
export const loginRequest = (email, password) => api.post("/auth/login", { email, password });

/**
 * ⭐ DÜZELTİLEN KISIM:
 * Fonksiyon adını 'register' yaptık ki Users.jsx içindeki import hatası çözülsün.
 * Parametre olarak 'userData' alıyoruz, böylece formdaki 'username' bilgisi de backend'e iletilir.
 */
export const register = (userData) => api.post("/auth/register", userData);
export const registerRequest = (userData) => api.post("/auth/register", userData);

/* KULLANICI İŞLEMLERİ */
export const getAllUsers = () => api.get("/users");
export const deleteUser = (id) => api.delete(`/users/${id}`);

/* KİTAP İŞLEMLERİ */
export const getAllBooks = () => api.get("/books");
export const getBookById = (id) => api.get(`/books/${id}`);
export const deleteBook = (id) => api.delete(`/books/${id}`);

/* ÖDÜNÇ İŞLEMLERİ (LOAN) */
export const borrowBook = (bookId, userId) => {
    return api.post("/loans/borrow", {
        bookId: Number(bookId),
        userId: Number(userId)
    });
};

export const returnBook = (loanId) => api.post(`/loans/return/${loanId}`);
export const getAllLoans = () => api.get("/loans");
export const getUserLoans = (userId) => api.get(`/loans/user/${userId}`);

export default api;