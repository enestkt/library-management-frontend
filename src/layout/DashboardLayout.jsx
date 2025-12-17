import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/layout.css";

function DashboardLayout() {
    return (
        <div className="layout">
            {/* Sol taraf sabit Sidebar */}
            <Sidebar />

            {/* Sağ taraf Navbar + Değişen İçerik */}
            <div className="main">
                <Navbar />
                <main className="content">
                    {/* Sayfalar (Dashboard, Books vb.) buraya gelir */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;