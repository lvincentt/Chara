import { Link } from "react-router-dom";
import { FiShoppingCart, FiX } from "react-icons/fi";

export default function CartDropdown({
  cartItems,
  getTotalPrice,
  removeFromCart,
  onClose,
}) {
  return (
    <div
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
      onMouseLeave={onClose}
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
      </div>

      {cartItems.length === 0 ? (
        <div className="px-4 py-6 text-center text-gray-500">
          <FiShoppingCart className="mx-auto w-12 h-12 text-gray-300 mb-2" />
          <p>Cart is empty</p>
        </div>
      ) : (
        <>
          <div className="max-h-64 overflow-y-auto">
            {cartItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × Rp
                    {parseFloat(item.product.price).toLocaleString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {cartItems.length > 4 && (
            <div className="px-4 py-2 text-center text-sm text-gray-500 border-t border-gray-100">
              +{cartItems.length - 4} more items
            </div>
          )}

          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-bold text-lg text-gray-900">
                Rp{getTotalPrice().toLocaleString("id-ID")}
              </span>
            </div>
            <Link
              to="/cart"
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 block text-center"
              onClick={onClose}
            >
              View Cart
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
