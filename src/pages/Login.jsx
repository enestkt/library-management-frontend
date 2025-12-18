import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../api/api";
import toast from "react-hot-toast";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await loginRequest(email, password);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            toast.success("Giriş başarılı");
            navigate("/dashboard");
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Giriş başarısız"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold">
                        Hoş Geldiniz
                    </h1>
                    <p className="text-slate-500 text-sm mt-2">
                        Yönetim paneline giriş yapın
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <input
                        type="email"
                        placeholder="E-posta"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        placeholder="Şifre"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-bold text-white transition ${
                            loading
                                ? "bg-slate-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    Hesabınız yok mu?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-bold"
                    >
                        Kayıt Ol
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
