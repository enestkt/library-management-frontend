// src/layout/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* SIDEBAR */}
            <Sidebar />

            {/* SAĞ TARAF */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* NAVBAR */}
                <Navbar />

                {/* SAYFA İÇERİĞİ */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
