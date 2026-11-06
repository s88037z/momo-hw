import type { ProductSearchResponse } from "./types";

export async function fetchProducts(signal?: AbortSignal): Promise<ProductSearchResponse> {
  const response = await fetch("/api/products", { signal });
  if (!response.ok) throw new Error(`商品讀取失敗 (${response.status})`);
  return response.json() as Promise<ProductSearchResponse>;
}
