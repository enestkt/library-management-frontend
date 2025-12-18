import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest } from "../api/api";
import toast from "react-hot-toast";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await registerRequest(name, email, password);
            toast.success("Kayıt başarılı");
            navigate("/login");
        } catch {
            toast.error("Kayıt başarısız");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold">
                        Kayıt Ol
                    </h1>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <input
                        placeholder="Ad Soyad"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                    <input
                        type="email"
                        placeholder="E-posta"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                    <input
                        type="password"
                        placeholder="Şifre"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 border rounded-xl"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-bold text-white ${
                            loading
                                ? "bg-slate-400"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    Zaten hesabın var mı?{" "}
                    <Link
                        to="/login"
                        className="text-green-600 font-bold"
                    >
                        Giriş Yap
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
