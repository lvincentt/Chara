const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function http(url, init) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...init,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // auth (dummy)
  me: () => http("/auth/me"),
  login: (username, password) =>
    http("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  // products
  listProducts: (params = {}) => {
    const q = new URLSearchParams();
    if (params.is_best_seller !== undefined)
      q.set("is_best_seller", String(params.is_best_seller));
    if (params.is_limited_edition !== undefined)
      q.set("is_limited_edition", String(params.is_limited_edition));
    if (params.is_staff_picks !== undefined)
      q.set("is_staff_picks", String(params.is_staff_picks));
    const qs = q.toString();
    return http(`/products/${qs ? `?${qs}` : ""}`);
  },
  getProduct: (id) => http(`/products/${id}/`),

  // cart
  getCart: () => http("/cart/"),
  addToCart: (product_id, quantity = 1) =>
    http("/cart/", {
      method: "POST",
      body: JSON.stringify({ product_id, quantity }),
    }),
  updateCartItem: (id, quantity) =>
    http(`/cart/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),
  removeCartItem: (id) =>
    fetch(`${BASE}/cart/${id}/`, { method: "DELETE" }).then(async (r) => {
      if (!r.ok) throw new Error(await r.text());
      return true;
    }),

  // checkout preview
  checkoutPreview: (selected_ids) =>
    http("/checkout/", {
      method: "POST",
      body: JSON.stringify({ selected_ids }),
    }),
};
