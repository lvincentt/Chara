import { createContext, useEffect, useState } from "react";
import { api } from "../lib/apiClient"; // pakai apiClient.js

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Saat pertama kali load, coba ambil user dummy dari mock API
  useEffect(() => {
    async function fetchUser() {
      try {
        const me = await api.me();
        setUser(me);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function login(username = "demo", password = "demo") {
    try {
      const loggedIn = await api.login(username, password);
      setUser(loggedIn);
      return true;
    } catch (err) {
      console.error("Login gagal:", err);
      return false;
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
