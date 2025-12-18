import { useEffect, useState } from "react";

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // fetchUsers();
    }, []);

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">
                        Users
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Kayıtlı tüm kullanıcılar
                    </p>
                </div>

                <button className="px-5 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition">
                    ➕ Yeni Kullanıcı
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b text-slate-500">
                        <tr>
                            <th className="text-left py-3">Ad Soyad</th>
                            <th className="text-left py-3">E-posta</th>
                            <th className="text-left py-3">Rol</th>
                            <th className="text-right py-3">İşlemler</th>
                        </tr>
                        </thead>

                        <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="py-10 text-center text-slate-400"
                                >
                                    Henüz kullanıcı yok
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b last:border-0 hover:bg-slate-50 transition"
                                >
                                    <td className="py-3 font-medium">
                                        {user.name}
                                    </td>
                                    <td className="py-3">
                                        {user.email}
                                    </td>
                                    <td className="py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                user.role === "ADMIN"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-slate-100 text-slate-700"
                                            }`}>
                                                {user.role}
                                            </span>
                                    </td>
                                    <td className="py-3 text-right space-x-2">
                                        <button className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition font-semibold">
                                            Düzenle
                                        </button>
                                        <button className="px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition font-semibold">
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Users;
