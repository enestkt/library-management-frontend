import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Users from "./pages/Users";
import Loans from "./pages/Loans";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";
import Profile from "./pages/Profile";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="books" element={<Books />} />
                    <Route path="users" element={<Users />} />
                    <Route path="loans" element={<Loans />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
