import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/apiClient"; // ✅ ganti dari AxiosInterceptor ke mock API
import { useState } from "react";

const initialForm = {
  username: "",
  email: "",
  password: "",
  password2: "",
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      alert("Password dan konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      // ✅ panggil mock API register
      const user = await api.register(form.username, form.email, form.password);
      console.log("Registered:", user);
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Registrasi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-primary">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="border rounded-md px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded-md px-3 py-2"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="border rounded-md px-3 py-2"
            required
            autoComplete="new-password"
          />
          <input
            type="password"
            name="password2"
            value={form.password2}
            onChange={handleChange}
            placeholder="Konfirmasi Password"
            className="border rounded-md px-3 py-2"
            required
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary_light text-white py-2 rounded-md transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Sudah punya akun..?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
