import type { ProductFacet } from "@/features/products/types";

interface BrandFiltersProps {
  brands: ProductFacet[];
  categories: ProductFacet[];
  selectedBrand: string;
  onBrandChange?: (brand: string) => void;
}

export function BrandFilters({ brands, categories, selectedBrand, onBrandChange }: BrandFiltersProps) {
  return (
    <section aria-label="商品篩選" className="border border-momo-line text-sm">
      <div className="flex border-b border-momo-line">
        <div className="flex w-17 shrink-0 items-center bg-[#f5f5f5] px-3 py-3 sm:w-22">分類</div>
        <ul className="flex flex-1 flex-wrap items-center gap-x-10 gap-y-2 px-4 py-3 sm:gap-x-16">
          {categories.map(({ value, count }) => <li key={value}>{value} <span className="text-[#666]">({count})</span></li>)}
        </ul>
      </div>
      <div className="flex">
        <h2 className="flex w-17 shrink-0 items-center bg-[#f5f5f5] px-3 py-3 font-normal sm:w-22">品牌</h2>
        <div className="grid flex-1 grid-cols-2 gap-1 px-2 py-2 sm:grid-cols-4 sm:px-3">
          {brands.map(({ value, count }) => (
            <button key={value} type="button" aria-pressed={selectedBrand === value} disabled={!onBrandChange} onClick={() => onBrandChange?.(selectedBrand === value ? "" : value)} className={`min-w-0 rounded-sm px-2 py-2 text-left break-words disabled:cursor-not-allowed ${selectedBrand === value ? "bg-pink-50 text-momo" : "text-[#333] enabled:hover:text-momo"}`}>
              {value === "RHINOSHIELD" ? "RHINOSHIELD 犀牛盾" : value} <span>({count})</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
