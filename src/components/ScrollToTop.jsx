import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll ke atas setiap kali route berubah
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // bisa "auto" kalau mau instan
    });
  }, [pathname]);

  return null;
}
