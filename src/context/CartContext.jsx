import { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { api } from "../lib/apiClient"; // ✅ ganti dari AxiosInterceptor ke apiClient

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [user]);

  async function fetchCartItems() {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await api.getCart(); // mock API return langsung array
      setCartItems(data);
    } catch (error) {
      console.error("Gagal mengambil data cart:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addToCart(productId, quantity = 1) {
    try {
      await api.addToCart(productId, quantity);
      await fetchCartItems();
      return true;
    } catch (error) {
      console.error("Gagal menambahkan ke keranjang:", error);
      return false;
    }
  }

  async function updateCartItem(itemId, newQuantity) {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    try {
      await api.updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error("Gagal update quantity:", error);
      await fetchCartItems(); // revert
    }
  }

  async function removeFromCart(itemId) {
    try {
      await api.removeCartItem(itemId);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      return true;
    } catch (error) {
      console.error("Gagal hapus item:", error);
      return false;
    }
  }

  function getTotalItems() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  function getTotalPrice() {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const value = {
    cartItems,
    isLoading,
    fetchCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
