import { http, HttpResponse } from "msw";
import { parseSearchParams } from "@/features/products/search-params";
import { searchProducts } from "@/features/products/search-products";
import { products } from "./products";

export const handlers = [
  http.get("/api/products", ({ request }) => {
    const query = parseSearchParams(new URL(request.url).searchParams);
    return HttpResponse.json(searchProducts(products, query));
  }),
];
