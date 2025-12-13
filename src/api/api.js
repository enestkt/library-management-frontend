import axios from "axios";

/**
 * BASE CONFIG
 * backend: http://localhost:8080
 * tüm endpointler /api/... şeklinde
 */
const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

// ===== TOKEN INTERCEPTOR =====
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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
