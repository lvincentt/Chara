import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleCart = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // cegah klik card ikut buka link

    const success = await addToCart(product.id, 1);
    alert(
      success
        ? "Berhasil ditambahkan ke keranjang!"
        : "Gagal menambahkan ke keranjang."
    );
  };

  return (
    <div className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            Rp{parseFloat(product.price).toLocaleString("id-ID")}
          </span>

          <button
            onClick={handleCart}
            className="bg-primary hover:bg-primary_light text-white p-2 rounded-lg transition-colors duration-200 group-hover:shadow-md"
          >
            <svg
              className="w-4 h-4"
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
          </button>
        </div>
      </div>
    </div>
  );
}
