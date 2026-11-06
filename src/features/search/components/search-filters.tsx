import type { ProductFacet } from "@/features/products/types";

interface SearchFiltersProps {
  brands: ProductFacet[];
  categories: ProductFacet[];
  selectedCategory: string;
  selectedBrand: string;
  onCategoryChange?: (category: string) => void;
  onBrandChange?: (brand: string) => void;
}

interface FacetRowProps {
  label: string;
  options: ProductFacet[];
  selected: string;
  onChange?: (value: string) => void;
}

function FacetRow({ label, options, selected, onChange }: FacetRowProps) {
  // Keep a removable selection even when a deep link or another filter yields no matches.
  const visible = selected && !options.some((option) => option.value.toLowerCase() === selected.toLowerCase())
    ? [{ value: selected, count: 0 }] : options;

  return (
    <div className="flex border-b border-momo-line last:border-0">
      <h2 className="flex w-17 shrink-0 items-center bg-[#f5f5f5] px-3 py-3 font-normal sm:w-22">{label}</h2>
      <div role="group" aria-label={`${label}篩選`} className="grid flex-1 grid-cols-2 gap-1 px-2 py-2 sm:grid-cols-4 sm:px-3">
        {visible.length === 0 && <p className="col-span-full px-2 py-2 text-[#888]">無符合的{label}</p>}
        {visible.map(({ value, count }) => {
          const active = selected.toLowerCase() === value.toLowerCase();
          const displayName = value === "RHINOSHIELD" ? "RHINOSHIELD 犀牛盾" : value;
          return <button key={value} type="button" aria-pressed={active} aria-label={active ? `取消${label} ${displayName} 篩選` : `${label} ${displayName} (${count})`}
            disabled={!onChange} onClick={() => onChange?.(active ? "" : value)}
            className={`min-w-0 rounded-sm px-2 py-2 text-left break-words disabled:cursor-not-allowed ${active ? "bg-pink-50 text-momo" : "text-[#333] enabled:hover:text-momo"}`}>
            {displayName} <span>({count})</span>{active && <span aria-hidden="true" className="ml-2">×</span>}
          </button>;
        })}
      </div>
    </div>
  );
}

export function SearchFilters({ brands, categories, selectedCategory, selectedBrand, onCategoryChange, onBrandChange }: SearchFiltersProps) {
  return (
    <section aria-label="商品篩選" className="border border-momo-line text-sm">
      <FacetRow label="分類" options={categories} selected={selectedCategory} onChange={onCategoryChange} />
      <FacetRow label="品牌" options={brands} selected={selectedBrand} onChange={onBrandChange} />
    </section>
  );
}
