import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulasi delay biar transisi lebih halus
    const timer = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!ready || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary border-solid"></div>
      </div>
    );
  }

  // Kalau belum login → redirect ke /login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
