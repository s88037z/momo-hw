import type { ProductSearchQuery, ProductSearchResponse } from "./types";
import { serializeSearchQuery } from "./search-params";

export async function fetchProducts(query: ProductSearchQuery, signal?: AbortSignal): Promise<ProductSearchResponse> {
  const params = serializeSearchQuery(query);
  const response = await fetch(`/api/products${params ? `?${params}` : ""}`, { signal });
  if (!response.ok) throw new Error(`商品讀取失敗 (${response.status})`);
  return response.json() as Promise<ProductSearchResponse>;
}
