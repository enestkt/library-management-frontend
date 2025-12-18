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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
            {/* ARKA PLAN */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-30 blur-sm"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000')" }}
            ></div>
            <div className="absolute inset-0 z-10 bg-slate-900/60"></div>

            {/* REGISTER KARTI */}
            <div className="relative z-20 w-full max-w-md bg-white/95 rounded-[2.5rem] shadow-2xl p-10 animate-in slide-in-from-bottom-10 duration-700">
                <div className="text-center mb-10">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Join Us</h2>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kayıt Ol</h1>
                    <p className="text-slate-500 text-sm mt-3 font-medium">Yeni bir hesap oluşturun</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Ad Soyad</label>
                        <input
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none font-medium"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">E-posta</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none font-medium"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Şifre</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm text-white shadow-lg shadow-emerald-500/30 transition-all active:scale-95 ${
                            loading ? "bg-slate-400" : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                    >
                        {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-slate-500">
                    Zaten hesabın var mı?{" "}
                    <Link to="/login" className="text-emerald-600 font-black hover:underline underline-offset-4 transition-all">
                        Giriş Yap
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;