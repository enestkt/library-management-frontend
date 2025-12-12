import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

// TOKEN
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ===== AUTH =====
export const login = (email, password) =>
    api.post("/auth/login", { email, password });

export const register = (email, password) =>
    api.post("/auth/register", { email, password });

// ===== BOOK =====
export const getBooks = () => api.get("/books");
export const deleteBook = (id) => api.delete(`/books/${id}`);

// ===== LOAN =====
export const borrowBook = (bookId, userId) =>
    api.post(`/loans/borrow/${bookId}/${userId}`);

export const returnBook = (loanId) =>
    api.post(`/loans/return/${loanId}`);

export const getUserLoans = (userId) =>
    api.get(`/loans/user/${userId}`);

// ===== DASHBOARD (şimdilik frontend hesaplıyor) =====
// ileride backend yazarsan:
// export const getDashboard = () => api.get("/dashboard/summary");

export default api;
