import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/apiClient";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // Ambil data produk dari mock API
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await api.getProduct(Number(id));
        setProduct(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        alert("Produk tidak ditemukan");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (quantity < 1) {
      alert("Masukkan jumlah yang valid.");
      return;
    }

    try {
      setAddingToCart(true);
      await api.addToCart(product.id, quantity);
      alert("Produk ditambahkan ke keranjang!");
      navigate("/cart");
    } catch (error) {
      console.error("Gagal menambahkan ke keranjang:", error);
      alert("Terjadi kesalahan saat menambahkan ke keranjang.");
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQty = useCallback(() => setQuantity((q) => q + 1), []);
  const decreaseQty = useCallback(
    () => setQuantity((q) => (q > 1 ? q - 1 : 1)),
    []
  );
  const handleInputChange = useCallback((e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) setQuantity(val === "" ? 1 : parseInt(val, 10));
  }, []);

  const formatPrice = (price) => parseFloat(price).toLocaleString("id-ID");

  // 🦴 Loading skeleton
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2">
            <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse mt-8"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Produk Tidak Ditemukan
          </h2>
          <p className="text-red-600 mb-4">
            Produk yang Anda cari tidak tersedia.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary_light text-white px-6 py-2 rounded-lg"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Gambar Produk */}
        <div className="w-full md:w-1/2">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Detail Produk */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Harga */}
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900">
                Rp{formatPrice(product.price)}
              </span>
            </div>

            <hr className="my-4" />

            {/* Deskripsi */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Deskripsi Produk
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "Tidak ada deskripsi tersedia."}
              </p>
            </div>
          </div>

          {/* Input Quantity + Tombol */}
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decreaseQty}
                  disabled={quantity <= 1}
                  className="px-4 py-3 text-lg font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  −
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleInputChange}
                  className="w-16 text-center outline-none border-x border-gray-300 py-3"
                />
                <button
                  onClick={increaseQty}
                  className="px-4 py-3 text-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-amber-900 hover:bg-amber-800 disabled:bg-amber-600 text-white py-3 px-6 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menambahkan...
                  </>
                ) : (
                  "ADD TO CART"
                )}
              </button>
            </div>

            <button
              className="w-full bg-black hover:bg-black/80 text-white font-semibold py-3 rounded-lg transition-colors"
              onClick={handleAddToCart}
            >
              BUY IT NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
