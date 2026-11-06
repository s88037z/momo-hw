"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/features/products/api";

export function SearchResults() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: ({ signal }) => fetchProducts(signal),
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-4 text-2xl font-bold">搜尋結果</h1>
      {isPending && <p role="status">載入商品中…</p>}
      {isError && <div role="alert">商品暫時無法載入。<button className="ml-2 text-momo underline" onClick={() => void refetch()}>重試</button></div>}
      {data && <>
        <p className="mb-4 text-sm text-neutral-600">共 {data.total} 件商品</p>
        <ul className="divide-y divide-neutral-200">
          {data.items.map((product) => (
            <li key={product.id} className="flex items-start justify-between gap-4 py-3">
              <span>{product.name}</span>
              <span className="whitespace-nowrap font-bold text-momo">${product.price.toLocaleString("zh-TW")}</span>
            </li>
          ))}
        </ul>
      </>}
    </main>
  );
}
