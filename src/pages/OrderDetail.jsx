import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function OrderDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");

  // 💡 simulasi fetch ke backend (mock)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const items = state?.items || [];
      const previewData = {
        items: items.map((item) => ({
          product_name: item.product.name,
          quantity: item.quantity,
          price: parseFloat(item.product.price),
          image: item.product.image_url,
          subtotal: parseFloat(item.product.price) * item.quantity,
        })),
      };

      previewData.total_price = previewData.items.reduce(
        (sum, i) => sum + i.subtotal,
        0
      );

      setPreview(previewData);
      setLoading(false);
    }, 500); // delay biar terasa “loading” sungguhan
    return () => clearTimeout(timeout);
  }, [state]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Mohon isi alamat pengiriman dengan lengkap.");
      return;
    }

    alert(
      `Pesanan kamu sudah dibuat 🎉\n\nAlamat: ${address}\nPembayaran: ${paymentMethod.toUpperCase()}`
    );

    // redirect ke halaman order sukses (mock)
    navigate("/");
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-600 animate-pulse">
        Loading checkout preview...
      </div>
    );

  if (!preview || !preview.items.length) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-20 text-center bg-white shadow rounded-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Tidak ada item yang dipilih
        </h2>
        <p className="text-gray-500 mb-6">
          Silakan pilih produk terlebih dahulu sebelum checkout.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary_light transition"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10 mb-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Rincian Pesanan</h1>

      {/* daftar produk */}
      <div className="space-y-4 mb-8">
        {preview.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <img
              src={item.image}
              alt={item.product_name}
              className="w-24 h-24 object-cover rounded-md mr-4"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {item.product_name}
              </h2>
              <p className="text-sm text-gray-500">
                Jumlah: {item.quantity} × Rp
                {item.price.toLocaleString("id-ID")}
              </p>
              <p className="text-base font-medium mt-1">
                Subtotal: Rp {item.subtotal.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right text-xl font-bold mb-6">
        Total: Rp {preview.total_price.toLocaleString("id-ID")}
      </div>

      {/* form alamat + pembayaran */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alamat Pengiriman
          </label>
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            rows={3}
            placeholder="Masukkan alamat lengkapmu..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Metode Pembayaran
          </label>
          <select
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="transfer">Transfer Bank</option>
            <option value="cod">Bayar di Tempat (COD)</option>
            <option value="ewallet">E-Wallet (OVO, GoPay, dll)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary_light text-white py-3 rounded-md font-semibold transition"
        >
          Bayar Sekarang
        </button>
      </form>
    </div>
  );
}
