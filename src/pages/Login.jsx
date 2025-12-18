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

            const token = res.data.token;
            const backendUser = res.data.user;

            if (!token || !backendUser) {
                throw new Error("Geçersiz giriş cevabı");
            }

            // 🔥 KRİTİK DÜZELTME BURASI
            const user = {
                id: backendUser.id,
                name: backendUser.name,
                email: backendUser.email,
                role: backendUser.role || "ADMIN" // role yoksa ADMIN varsay
            };

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            toast.success("Giriş başarılı");
            navigate("/dashboard");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err.message ||
                "Giriş başarısız"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000')"
                }}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900/80 to-slate-900/40" />

            <div className="relative z-20 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl p-10">
                <div className="text-center mb-10">
                    <div className="text-5xl mb-4">📚</div>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                        Library System
                    </h2>
                    <h1 className="text-4xl font-black text-slate-900">
                        Hoş Geldiniz
                    </h1>
                    <p className="text-slate-500 text-sm mt-3 font-medium">
                        Lütfen bilgilerinizi girerek devam edin
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-700 ml-1">
                            E-posta
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-5 py-4 bg-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/20 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 ml-1">
                            Şifre
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-5 py-4 bg-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/20 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl font-black uppercase text-white ${
                            loading
                                ? "bg-slate-400"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Hesabınız yok mu?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-black hover:underline"
                    >
                        Hemen Kaydolun
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
