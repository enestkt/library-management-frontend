import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="logo-section">
                <span className="logo-icon">📚</span>
                <h2 className="logo-text">Library MS</h2>
            </div>

            <nav className="menu">
                <NavLink to="/dashboard" end>
                    <span className="icon">📊</span> Dashboard
                </NavLink>
                <NavLink to="/dashboard/books">
                    <span className="icon">📖</span> Books
                </NavLink>
                <NavLink to="/dashboard/users">
                    <span className="icon">👥</span> Users
                </NavLink>
                <NavLink to="/dashboard/loans">
                    <span className="icon">🔄</span> Loans
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;