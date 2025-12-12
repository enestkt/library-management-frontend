// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="navbar">
            <span className="title">Library Management Panel</span>

            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>
        </header>
    );
}

export default Navbar;
