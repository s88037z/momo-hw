import type { ProductSearchQuery, ProductSort } from "./types";

const sorts: readonly ProductSort[] = ["recommended", "price-asc", "price-desc"];
const filterKeys = ["q", "category", "brand", "min", "max", "sort"] as const;

function parsePrice(value: string): number | undefined {
  const trimmed = value.trim();
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(trimmed)) return undefined;
  const price = Number(trimmed);
  return Number.isFinite(price) && price <= Number.MAX_SAFE_INTEGER ? price : undefined;
}

export type PriceValidation =
  | { valid: true; min?: number; max?: number }
  | { valid: false; message: string };

export function validatePriceRange(minimum: string, maximum: string): PriceValidation {
  const min = parsePrice(minimum);
  const max = parsePrice(maximum);
  if ((minimum.trim() && min === undefined) || (maximum.trim() && max === undefined)) {
    return { valid: false, message: "價格須為有效的非負數字" };
  }
  if (min !== undefined && max !== undefined && min > max) {
    return { valid: false, message: "最低價不可高於最高價" };
  }
  return { valid: true, min, max };
}

export function parseSearchParams(params: Pick<URLSearchParams, "get">): ProductSearchQuery {
  const rawPage = params.get("page") ?? "1";
  const page = /^\d+$/.test(rawPage) ? Number(rawPage) : 1;
  const sort = params.get("sort") as ProductSort | null;
  const prices = validatePriceRange(params.get("min") ?? "", params.get("max") ?? "");
  return {
    q: (params.get("q") ?? "").normalize("NFKC").trim().replace(/\s+/g, " "),
    category: (params.get("category") ?? "").normalize("NFKC").trim(),
    brand: (params.get("brand") ?? "").normalize("NFKC").trim(),
    min: prices.valid ? prices.min : undefined,
    max: prices.valid ? prices.max : undefined,
    sort: sort && sorts.includes(sort) ? sort : "recommended",
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  };
}

export function serializeSearchQuery(query: ProductSearchQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.brand) params.set("brand", query.brand);
  if (query.min !== undefined) params.set("min", String(query.min));
  if (query.max !== undefined) params.set("max", String(query.max));
  if (query.sort !== "recommended") params.set("sort", query.sort);
  if (query.page !== 1) params.set("page", String(query.page));
  return params.toString();
}

export function updateSearchQuery(current: ProductSearchQuery, patch: Partial<ProductSearchQuery>): ProductSearchQuery {
  // Use the same normalization for URL input, UI events, and API requests.
  const next = parseSearchParams(new URLSearchParams(serializeSearchQuery({ ...current, ...patch })));
  if (filterKeys.some((key) => next[key] !== current[key])) next.page = 1;
  return next;
}

export function clearSearchFilters(query: ProductSearchQuery): ProductSearchQuery {
  return { q: query.q, category: "", brand: "", min: undefined, max: undefined, sort: "recommended", page: 1 };
}
