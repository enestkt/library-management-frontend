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
        if (!window.confirm("Delete this user?")) return;
        await deleteUser(id);
        loadUsers();
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Users</h1>
                <p>Registered users</p>
            </div>

            <div className="card">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th style={{ width: 120 }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name || "-"}</td>
                                    <td>{u.email}</td>
                                    <td>
                                            <span className="badge">
                                                {u.role}
                                            </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn danger"
                                            onClick={() => handleDelete(u.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="empty">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
