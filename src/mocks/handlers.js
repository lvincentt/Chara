import { http, HttpResponse } from "msw";
import { products, categories, cartDB, demoUser } from "./data";

function parseBool(v) {
  if (v == null) return null;
  return v === "true" || v === "1";
}

export const handlers = [
  // AUTH (dummy)
  http.get("/auth/me", () => HttpResponse.json(demoUser)),
  http.post("/auth/login", async () => HttpResponse.json(demoUser)),

  // CATEGORIES
  http.get("/categories/", () => HttpResponse.json(categories)),

  // PRODUCTS (meniru DRF filterset_fields)
  http.get("/products/", ({ request }) => {
    const url = new URL(request.url);
    const qBest = parseBool(url.searchParams.get("is_best_seller"));
    const qLtd = parseBool(url.searchParams.get("is_limited_edition"));
    const qPick = parseBool(url.searchParams.get("is_staff_picks"));

    let data = products.filter((p) => p.is_active);
    if (qBest !== null) data = data.filter((p) => p.is_best_seller === qBest);
    if (qLtd !== null) data = data.filter((p) => p.is_limited_edition === qLtd);
    if (qPick !== null) data = data.filter((p) => p.is_staff_picks === qPick);

    return HttpResponse.json(data);
  }),

  // GET /products/:id/
  http.get("/products/:id/", ({ params }) => {
    const id = Number(params.id);
    const prod = products.find((p) => p.id === id && p.is_active);
    return prod
      ? HttpResponse.json(prod)
      : new HttpResponse("Not found", { status: 404 });
  }),

  // CART
  http.get("/cart/", () => {
    return HttpResponse.json(
      cartDB
        .list()
        .map((ci) => ({
          id: ci.id,
          product: ci.product,
          quantity: ci.quantity,
        }))
    );
  }),

  // POST /cart/ { product_id, quantity? }
  http.post("/cart/", async ({ request }) => {
    const body = await request.json();
    const prod = products.find((p) => p.id === body.product_id);
    if (!prod) return new HttpResponse("Invalid product", { status: 400 });
    const it = cartDB.add(prod, body.quantity ?? 1);
    return HttpResponse.json(
      { id: it.id, product: it.product, quantity: it.quantity },
      { status: 201 }
    );
  }),

  // PATCH /cart/:id/ { quantity }
  http.patch("/cart/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const body = await request.json();
    const upd = cartDB.update(id, body.quantity);
    return upd
      ? HttpResponse.json({
          id: upd.id,
          product: upd.product,
          quantity: upd.quantity,
        })
      : new HttpResponse("Not found", { status: 404 });
  }),

  // DELETE /cart/:id/
  http.delete("/cart/:id/", ({ params }) => {
    cartDB.remove(Number(params.id));
    return new HttpResponse(null, { status: 204 });
  }),

  // CHECKOUT PREVIEW
  http.post("/checkout/", async ({ request }) => {
    const body = await request.json();
    const items = cartDB
      .list()
      .filter((c) => body.selected_ids?.includes(c.id));
    if (items.length === 0) {
      return HttpResponse.json(
        { detail: "No valid cart items found." },
        { status: 400 }
      );
    }
    const preview = items.map((i) => ({
      product_name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      subtotal: i.product.price * i.quantity,
      image: i.product.image_url,
    }));
    const total_price = preview.reduce((s, x) => s + x.subtotal, 0);
    return HttpResponse.json({ items: preview, total_price });
  }),
];
