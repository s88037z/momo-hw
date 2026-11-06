import type { FormEvent } from "react";
import type { ProductSort } from "@/features/products/types";

const sorts: { value: ProductSort; label: string }[] = [
  { value: "recommended", label: "綜合推薦" },
  { value: "price-asc", label: "價格 低→高" },
  { value: "price-desc", label: "價格 高→低" },
];

interface SearchToolbarProps {
  sort: ProductSort;
  minPrice: string;
  maxPrice: string;
  onSortChange?: (sort: ProductSort) => void;
  onMinPriceChange?: (value: string) => void;
  onMaxPriceChange?: (value: string) => void;
  onPriceApply?: () => void;
  onClear?: () => void;
  priceError?: string;
}

export function SearchToolbar({ sort, minPrice, maxPrice, onSortChange, onMinPriceChange, onMaxPriceChange, onPriceApply, onClear, priceError }: SearchToolbarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onPriceApply?.();
  }

  return (
    <section aria-label="排序與價格" className="flex flex-wrap items-center gap-y-2 bg-[#e8e8e8] text-sm">
      <div role="group" aria-label="商品排序" className="flex">
        {sorts.map(({ value, label }) => <button key={value} type="button" disabled={!onSortChange} aria-pressed={sort === value} onClick={() => onSortChange?.(value)} className={`px-3 py-3.5 disabled:cursor-not-allowed sm:px-4 ${sort === value ? "bg-momo font-bold text-white" : "enabled:hover:text-momo"}`}>{label}</button>)}
      </div>
      <form noValidate onSubmit={handleSubmit} className="flex items-center gap-1.5 px-3 pb-2 sm:pb-0">
        <label htmlFor="minimum-price" className="sr-only">最低價格</label>
        <input id="minimum-price" type="text" inputMode="decimal" placeholder="最低價" value={minPrice} onChange={(event) => onMinPriceChange?.(event.target.value)} disabled={!onMinPriceChange} aria-invalid={Boolean(priceError)} aria-describedby={priceError ? "price-error" : undefined} className="w-20 min-w-0 bg-white px-2 py-1 text-xs placeholder:text-[#999] disabled:opacity-100" />
        <span className="text-[#777]">~</span>
        <label htmlFor="maximum-price" className="sr-only">最高價格</label>
        <input id="maximum-price" type="text" inputMode="decimal" placeholder="最高價" value={maxPrice} onChange={(event) => onMaxPriceChange?.(event.target.value)} disabled={!onMaxPriceChange} aria-invalid={Boolean(priceError)} aria-describedby={priceError ? "price-error" : undefined} className="w-20 min-w-0 bg-white px-2 py-1 text-xs placeholder:text-[#999] disabled:opacity-100" />
        <button type="submit" disabled={!onPriceApply} className="bg-[#666] px-3 py-1 text-xs text-white disabled:cursor-not-allowed">確認</button>
      </form>
      <div className="ml-auto flex items-center gap-3 px-3 pb-2 sm:py-2">
        <button type="button" disabled={!onClear} onClick={onClear} className="text-xs text-[#666] underline underline-offset-2 disabled:cursor-not-allowed">清除篩選</button>
        <span role="img" aria-label="商品網格檢視" className="border-l border-[#bbb] pl-3 text-xl leading-none text-momo">▦</span>
      </div>
      {priceError && <p id="price-error" role="alert" className="w-full px-3 pb-2 text-xs text-red-700">{priceError}</p>}
    </section>
  );
}
