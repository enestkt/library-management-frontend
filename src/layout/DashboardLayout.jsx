// src/layout/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
    return (
        <div className="layout">
            <Sidebar />

            <div className="main">
                <Navbar />

                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
