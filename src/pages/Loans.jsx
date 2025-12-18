import { useEffect, useState } from "react";

function Loans() {
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        // fetchLoans();
    }, []);

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900">
                    Loans
                </h1>
                <p className="text-slate-500 mt-1">
                    Ödünç verilen kitaplar
                </p>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b text-slate-500">
                        <tr>
                            <th className="text-left py-3">Kitap</th>
                            <th className="text-left py-3">Kullanıcı</th>
                            <th className="text-left py-3">Tarih</th>
                            <th className="text-left py-3">Durum</th>
                        </tr>
                        </thead>

                        <tbody>
                        {loans.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="py-10 text-center text-slate-400"
                                >
                                    Aktif ödünç yok
                                </td>
                            </tr>
                        ) : (
                            loans.map((loan) => (
                                <tr
                                    key={loan.id}
                                    className="border-b last:border-0 hover:bg-slate-50 transition"
                                >
                                    <td className="py-3 font-medium">
                                        {loan.bookTitle}
                                    </td>
                                    <td className="py-3">
                                        {loan.userName}
                                    </td>
                                    <td className="py-3">
                                        {loan.loanDate}
                                    </td>
                                    <td className="py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                loan.returned
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-orange-100 text-orange-700"
                                            }`}>
                                                {loan.returned ? "Teslim" : "Ödünçte"}
                                            </span>
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

export default Loans;
