"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/features/products/api";
import { clearSearchFilters, validatePriceRange } from "@/features/products/search-params";
import Link from "next/link";
import { ProductCard } from "@/features/products/product-card";
import { SearchHeader } from "./components/search-header";
import { SearchFilters } from "./components/search-filters";
import { SearchToolbar } from "./components/search-toolbar";
import { SearchPagination } from "./components/search-pagination";
import { useSearchState } from "./use-search-state";

export function SearchResults() {
  const state = useSearchState();
  // Reset unsent drafts on URL changes, including browser back/forward navigation.
  return <SearchResultsContent key={state.queryString} {...state} />;
}

function SearchResultsContent({ query, updateQuery, replacePage, isNavigating }: ReturnType<typeof useSearchState>) {
  const [searchDraft, setSearchDraft] = useState(query.q);
  const [minDraft, setMinDraft] = useState(query.min?.toString() ?? "");
  const [maxDraft, setMaxDraft] = useState(query.max?.toString() ?? "");
  const [priceError, setPriceError] = useState("");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["products", query],
    queryFn: ({ signal }) => fetchProducts(query, signal),
  });

  useEffect(() => {
    if (data) replacePage(data.page);
  }, [data, replacePage]);

  function applyPrices() {
    const result = validatePriceRange(minDraft, maxDraft);
    if (!result.valid) {
      setPriceError(result.message);
      return;
    }
    setPriceError("");
    updateQuery({ min: result.min, max: result.max });
  }

  function clearFilters() {
    setMinDraft("");
    setMaxDraft("");
    setPriceError("");
    updateQuery(clearSearchFilters(query));
  }

  return (
    <>
      <SearchHeader query={searchDraft} onQueryChange={isNavigating ? undefined : setSearchDraft} onSearch={isNavigating ? undefined : () => updateQuery({ q: searchDraft })} />
      <main className="page-container pb-12" aria-busy={isNavigating || isPending}>
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
          <SearchFilters brands={data.brands} categories={data.categories} selectedCategory={query.category} selectedBrand={query.brand}
            onCategoryChange={isNavigating ? undefined : (category) => updateQuery({ category })}
            onBrandChange={isNavigating ? undefined : (brand) => updateQuery({ brand })} />
          <div className="flex items-center justify-between gap-3 py-4 text-xs sm:py-5">
            <p role="status" className="text-[#777]">共 <span className="font-bold text-[#555]">{data.total}</span> 件商品</p>
            {data.total > 0 && <SearchPagination page={data.page} pageCount={Math.ceil(data.total / data.pageSize)} onPageChange={isNavigating ? undefined : (page) => updateQuery({ page })} />}
          </div>
          <SearchToolbar sort={query.sort} minPrice={minDraft} maxPrice={maxDraft} priceError={priceError}
            onSortChange={isNavigating ? undefined : (sort) => updateQuery({ sort })}
            onMinPriceChange={isNavigating ? undefined : (value) => { setMinDraft(value); setPriceError(""); }}
            onMaxPriceChange={isNavigating ? undefined : (value) => { setMaxDraft(value); setPriceError(""); }}
            onPriceApply={isNavigating ? undefined : applyPrices}
            onClear={isNavigating ? undefined : clearFilters} />
          {data.total === 0 ? <section role="status" className="px-5 py-20 text-center text-sm">
            <h2 className="mb-2 text-lg font-bold">找不到符合條件的商品</h2>
            <p className="mb-4 text-[#777]">請調整關鍵字或清除篩選條件後再試一次。</p>
            <button type="button" onClick={clearFilters} disabled={isNavigating} className="text-momo underline">清除篩選條件</button>
          </section> : <ul aria-label="商品列表" className="mt-5 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 xl:grid-cols-6">
            {data.items.map((product, index) => <li key={product.id} className="min-w-0"><ProductCard product={product} priority={index < 6} /></li>)}
          </ul>}
          {data.total > 0 && <div className="mt-8 border-t border-momo-line pt-5"><SearchPagination page={data.page} pageCount={Math.ceil(data.total / data.pageSize)} onPageChange={isNavigating ? undefined : (page) => updateQuery({ page })} /></div>}
        </>}
        <footer className="mt-10 border-t border-momo-line pt-4 text-center text-[11px] leading-5 text-[#999]">前端作業展示・商品資料與優惠內容為模擬資料</footer>
      </main>
    </>
  );
}
