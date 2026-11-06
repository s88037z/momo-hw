import { http, HttpResponse } from "msw";
import type { ProductSearchResponse } from "@/features/products/types";
import { products } from "./products";

// Step 1 establishes the HTTP contract. Query parameters are implemented in step 3.
export const handlers = [
  http.get("/api/products", () => HttpResponse.json<ProductSearchResponse>({
    items: products.slice(0, 12),
    total: products.length,
    page: 1,
    pageSize: 12,
    brands: [...new Set(products.map((product) => product.brand))].map((value) => ({
      value, count: products.filter((product) => product.brand === value).length,
    })),
    categories: [...new Set(products.map((product) => product.category))].map((value) => ({
      value, count: products.filter((product) => product.category === value).length,
    })),
  })),
];
