import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import OrderDetail from "./pages/OrderDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <ScrollToTop />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes (mock login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<OrderDetail />} />
          </Route>

          {/* Optional: fallback route */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className="text-3xl font-bold mb-2">404 Not Found</h1>
                <p className="text-gray-500 mb-6">
                  Halaman yang kamu cari tidak ditemukan.
                </p>
                <a
                  href="/"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary_light transition"
                >
                  Kembali ke Beranda
                </a>
              </div>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
