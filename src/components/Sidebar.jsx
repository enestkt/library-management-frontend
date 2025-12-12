// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">
            <h2 className="logo">📚 Library</h2>

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
    );
}

export default Sidebar;
