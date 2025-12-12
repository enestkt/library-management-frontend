import api from "./api";

// Book borrow
export const borrowBook = (bookId, userId) => {
    return api.post(`/api/loans/borrow/${bookId}/${userId}`);
};

// Book return
export const returnBook = (loanId) => {
    return api.post(`/api/loans/return/${loanId}`);
};

// User loan history
export const getUserLoans = (userId) => {
    return api.get(`/api/loans/user/${userId}`);
};

export const getAllUsers = () =>
    api.get("/api/users");

export const getAllBooks = () =>
    api.get("/api/books");

export const getAllLoans = () =>
    api.get("/api/loans");

