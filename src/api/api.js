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
export const registerRequest = (name, email, password) => api.post("/auth/register", { name, email, password });

/* KULLANICI İŞLEMLERİ */
export const getAllUsers = () => api.get("/users");
export const deleteUser = (id) => api.delete(`/users/${id}`);

/* KİTAP İŞLEMLERİ */
// Loans.jsx içindeki kullanıma göre getAllBooks ismini sabitledik
export const getAllBooks = () => api.get("/books");
export const getBookById = (id) => api.get(`/books/${id}`);
export const deleteBook = (id) => api.delete(`/books/${id}`);

/* ÖDÜNÇ İŞLEMLERİ (LOAN) */

// ⭐ DÜZELTİLEN KRİTİK KISIM:
// Backend @RequestBody LoanRequestDto beklediği için veriyi JSON objesi olarak gönderiyoruz.
export const borrowBook = (bookId, userId) => {
    return api.post("/loans/borrow", {
        bookId: Number(bookId),
        userId: Number(userId)
    });
};

// İade işlemi backend'de @PathVariable olduğu için URL içinden gönderilmeye devam ediyor.
export const returnBook = (loanId) => api.post(`/loans/return/${loanId}`);

export const getAllLoans = () => api.get("/loans");
export const getUserLoans = (userId) => api.get(`/loans/user/${userId}`);

export default api;