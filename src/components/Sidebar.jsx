import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col flex-shrink-0 sticky top-0 shadow-xl">
            {/* LOGO ALANI */}
            <div className="p-8 flex items-center gap-3 border-b border-white/5">
                <span className="text-3xl">📚</span>
                <h2 className="text-xl font-bold tracking-tight">Library MS</h2>
            </div>

            {/* MENÜ LİNKLERİ */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                <SidebarLink to="/dashboard" icon="📊" label="Dashboard" end />
                <SidebarLink to="/dashboard/books" icon="📖" label="Books" />
                <SidebarLink to="/dashboard/users" icon="👥" label="Users" />
                <SidebarLink to="/dashboard/loans" icon="🔄" label="Loans" />
            </nav>

            {/* ALT BİLGİ (Opsiyonel) */}
            <div className="p-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest border-t border-white/5">
                v1.0.0 Admin Panel
            </div>
        </aside>
    );
}

// Yardımcı Link Bileşeni
function SidebarLink({ to, icon, label, end = false }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
            }
        >
            <span className="text-lg">{icon}</span>
            {label}
        </NavLink>
    );
}

export default Sidebar;