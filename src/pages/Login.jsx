import { api } from "../lib/apiClient";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      alert("Username dan password wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      const user = await api.login(username, password);
      await login(username, password); // fungsi dari AuthContext
      alert(`Selamat datang, ${user.username}!`);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Login gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-primary">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="border rounded-md px-3 py-2"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border rounded-md px-3 py-2"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary_light text-white py-2 rounded-md transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Belum punya akun..?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
