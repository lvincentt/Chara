import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    updateCartItem,
    removeFromCart,
    getTotalPrice,
    isLoading,
  } = useContext(CartContext);

  const [selectedItems, setSelectedItems] = useState([]);
  const [inputQuantities, setInputQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize input quantities ketika cartItems berubah
    const initialQuantities = {};
    cartItems.forEach((item) => {
      initialQuantities[item.id] = item.quantity.toString();
    });
    setInputQuantities(initialQuantities);
  }, [cartItems]);

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    await updateCartItem(itemId, newQty);
  };

  const handleDeleteItem = async (itemId) => {
    const success = await removeFromCart(itemId);
    if (!success) {
      alert("Gagal menghapus item dari cart");
    }
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const getSelectedTotalPrice = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    const itemsToCheckout = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    navigate("/checkout", { state: { items: itemsToCheckout } });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">🛒 My Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="mx-auto w-24 h-24 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8v6a2 2 0 002 2h8a2 2 0 002-2v-6"
            />
          </svg>
          <p className="text-gray-500 text-lg mb-4">Keranjang kosong.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center border border-gray-200 rounded-lg shadow hover:shadow-md transition-all p-4 bg-white"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelectItem(item.id)}
                className="accent-black mr-4"
              />
              <img
                src={item.product.image_url}
                className="w-24 h-24 object-cover rounded-md"
                alt={item.product.name}
              />
              <div className="flex-1 ml-4">
                <h4 className="font-semibold text-lg truncate">
                  {item.product.name}
                </h4>
                <div className="mt-1">
                  <span className="text-lg font-semibold text-black">
                    Rp {parseFloat(item.product.price).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center mt-4 gap-3">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg font-bold"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    value={inputQuantities[item.id] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setInputQuantities({
                          ...inputQuantities,
                          [item.id]: value,
                        });
                      }
                    }}
                    onBlur={() => {
                      const parsed = parseInt(inputQuantities[item.id], 10);
                      if (!isNaN(parsed) && parsed >= 1) {
                        handleUpdateQuantity(item.id, parsed);
                      } else {
                        const originalQty =
                          cartItems.find((i) => i.id === item.id)?.quantity ||
                          1;
                        setInputQuantities({
                          ...inputQuantities,
                          [item.id]: originalQty.toString(),
                        });
                      }
                    }}
                    className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                  />
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checkout Section */}
      {cartItems.length > 0 && (
        <div className="sticky bottom-0 mt-10 bg-white pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center max-w-5xl mx-auto px-6 pb-6">
            <p className="text-xl font-semibold">
              Total: Rp {getSelectedTotalPrice().toLocaleString("id-ID")}
            </p>
            <button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
                selectedItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              Checkout ({selectedItems.length} items)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
