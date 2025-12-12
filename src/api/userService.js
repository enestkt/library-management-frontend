import api from "./api";

// Tüm kullanıcıları getir
export const getAllUsers = () => {
    return api.get("/users");
};

// Kullanıcı sil
export const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
};
