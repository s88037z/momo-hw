"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/features/products/api";
import Link from "next/link";
import { ProductCard } from "@/features/products/product-card";
import { SearchHeader } from "./components/search-header";
import { BrandFilters } from "./components/brand-filters";
import { SearchToolbar } from "./components/search-toolbar";
import { SearchPagination } from "./components/search-pagination";

export function SearchResults() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: ({ signal }) => fetchProducts(signal),
  });

  return (
    <>
      <SearchHeader query="iphone 17 pro" />
      <main className="page-container pb-12">
        <h1 className="sr-only">搜尋結果</h1>
        <nav aria-label="麵包屑" className="flex items-center gap-3 py-4 text-sm">
          <span aria-hidden="true" className="text-lg leading-none text-[#b8b8b8]">⌖</span>
          <Link href="/" className="text-[#a98043]">Home</Link>
          <span aria-hidden="true" className="text-[#aaa]">\</span>
          <span aria-current="page">搜尋結果</span>
        </nav>
        {isPending && <p role="status" className="border border-momo-line px-5 py-16 text-center text-sm text-[#777]">載入商品中…</p>}
        {isError && <div role="alert" className="border border-momo-line px-5 py-16 text-center text-sm">商品暫時無法載入。<button className="ml-2 text-momo underline" onClick={() => void refetch()}>重試</button></div>}
        {data && <>
          <BrandFilters brands={data.brands} categories={data.categories} selectedBrand="" />
          <div className="flex items-center justify-between gap-3 py-4 text-xs sm:py-5">
            <p role="status" className="text-[#777]">共 <span className="font-bold text-[#555]">{data.total}</span> 件商品</p>
            <SearchPagination page={data.page} pageCount={Math.ceil(data.total / data.pageSize)} />
          </div>
          <SearchToolbar sort="recommended" minPrice="" maxPrice="" />
          <ul aria-label="商品列表" className="mt-5 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 xl:grid-cols-6">
            {data.items.map((product, index) => <li key={product.id} className="min-w-0"><ProductCard product={product} priority={index < 6} /></li>)}
          </ul>
          <div className="mt-8 border-t border-momo-line pt-5"><SearchPagination page={data.page} pageCount={Math.ceil(data.total / data.pageSize)} /></div>
        </>}
        <footer className="mt-10 border-t border-momo-line pt-4 text-center text-[11px] leading-5 text-[#999]">前端作業展示・商品資料與優惠內容為模擬資料</footer>
      </main>
    </>
  );
}
