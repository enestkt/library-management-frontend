import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../api/userService";
import "../styles/pages.css";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsers();
            setUsers(res.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
        await deleteUser(id);
        loadUsers();
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Users Directory</h1>
                <p>Manage registered members and admins</p>
            </div>

            <div className="card" style={{ padding: "0", overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading users...</div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                            <tr>
                                <th style={{ width: "80px" }}>ID</th>
                                <th>User Info</th>
                                <th>Email Address</th>
                                <th>Role</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td style={{ color: "#94a3b8" }}>#{u.id}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{
                                                width: "32px", height: "32px", borderRadius: "50%", background: "#3b82f6", color: "white",
                                                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "14px"
                                            }}>
                                                {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <span style={{ fontWeight: "500", color: "#0f172a" }}>{u.name || "No Name"}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: "#475569" }}>{u.email}</td>
                                    <td>
                                            <span style={{
                                                padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                                                background: u.role === "ADMIN" ? "#ede9fe" : "#f1f5f9",
                                                color: u.role === "ADMIN" ? "#7c3aed" : "#475569",
                                                border: "1px solid transparent"
                                            }}>
                                                {u.role}
                                            </span>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            className="btn-danger"
                                            onClick={() => handleDelete(u.id)}
                                            style={{ fontSize: "12px" }}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr><td colSpan="5" style={{ padding: "40px", textAlign: "center" }}>No users found.</td></tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}