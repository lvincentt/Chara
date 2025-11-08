import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiBox, FiLogOut } from "react-icons/fi";

export default function UserDropdown({ user, logout, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert("Berhasil Logout");
    navigate("/login");
  };

  return (
    <div
      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
      onMouseLeave={onClose}
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">
          Hello, {user?.username || "User"}
        </p>
      </div>

      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
        onClick={onClose}
      >
        <div className="flex items-center gap-2">
          <FiUser className="w-4 h-4" />
          Profile
        </div>
      </Link>

      <Link
        to="/orders"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
        onClick={onClose}
      >
        <div className="flex items-center gap-2">
          <FiBox className="w-4 h-4" />
          My Orders
        </div>
      </Link>

      <hr className="my-2 border-gray-100" />

      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
      >
        <div className="flex items-center gap-2">
          <FiLogOut className="w-4 h-4" />
          Logout
        </div>
      </button>
    </div>
  );
}
