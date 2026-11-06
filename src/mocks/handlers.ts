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
  })),
];
