import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const token = localStorage.getItem("token");
    // Token yoksa login sayfasına at, varsa alt rotaları (Outlet) göster
    return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;