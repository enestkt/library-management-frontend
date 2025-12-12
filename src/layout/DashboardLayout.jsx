import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../styles/layout.css";

function DashboardLayout() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="layout">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="logo">📚 Library</div>

                <nav className="menu">
                    <NavLink to="/dashboard" end>
                        Dashboard
                    </NavLink>

                    <NavLink to="/dashboard/books">
                        Books
                    </NavLink>

                    <NavLink to="/dashboard/users">
                        Users
                    </NavLink>

                    <NavLink to="/dashboard/loans">
                        Loans
                    </NavLink>
                </nav>
            </aside>

            {/* MAIN AREA */}
            <div className="main">
                {/* NAVBAR */}
                <header className="navbar">
                    <div className="title">Library Management System</div>
                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                </header>

                {/* CONTENT */}
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
