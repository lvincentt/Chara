import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { FiUser, FiShoppingCart, FiChevronDown } from "react-icons/fi";
import CartDropdown from "./CartDropdown";
import UserDropdown from "./UserDropdown";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, getTotalItems, getTotalPrice, removeFromCart } =
    useContext(CartContext);

  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const cartDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target)
      ) {
        setShowCartDropdown(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="px-6 lg:px-10 py-6 shadow-lg bg-white sticky top-0 z-50">
      <div className="max-w-7xl flex justify-between items-center mx-auto">
        <Link
          to="/"
          className="font-playfair text-primary lg:text-4xl font-bold hover:text-primary_light transition text-2xl"
        >
          CHARA
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            {/* Cart Dropdown */}
            <div className="relative" ref={cartDropdownRef}>
              <button
                className="relative p-2 hover:bg-gray-100 rounded-full transition"
                onClick={() => setShowCartDropdown(!showCartDropdown)}
              >
                <FiShoppingCart className="w-6 h-6 text-gray-700" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              {showCartDropdown && (
                <CartDropdown
                  cartItems={cartItems}
                  getTotalPrice={getTotalPrice}
                  removeFromCart={removeFromCart}
                  onClose={() => setShowCartDropdown(false)}
                />
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <FiUser className="w-6 h-6 text-gray-700" />
                <FiChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    showUserDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showUserDropdown && (
                <UserDropdown
                  user={user}
                  logout={logout}
                  onClose={() => setShowUserDropdown(false)}
                />
              )}
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition font-medium"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
