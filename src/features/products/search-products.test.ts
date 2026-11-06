import { describe, expect, it } from "vitest";
import { clearSearchFilters, parseSearchParams, updateSearchQuery } from "./search-params";
import { searchProducts } from "./search-products";
import type { Product } from "./types";

function product(id: string, price: number, overrides: Partial<Product> = {}): Product {
  return {
    id, price, name: "iPhone 17 Pro", brand: "Apple", category: "手機", keywords: [],
    image: "/test.webp", originalPrice: price + 100, rating: 4, reviewCount: 1,
    salesCount: 1, promotion: "", campaignLabel: "", fastDelivery: false, ...overrides,
  };
}

// Deliberately small, independent examples. Expected results are not computed by the implementation.
const catalog = [
  product("c", 200),
  product("a", 100, { name: "iPhone 17 Pro Max" }),
  product("b", 100, { brand: "UAG", category: "手機配件", name: "iPhone 17 Pro Case" }),
  product("d", 300, { brand: "HODA", category: "手機配件", name: "螢幕保護貼", keywords: ["iphone", "17", "pro"] }),
  product("e", 50, { name: "MacBook" }),
  product("f", 0, { brand: "RHINOSHIELD", category: "手機配件" }),
];
const query = (value = "") => parseSearchParams(new URLSearchParams(value));
const ids = (result: ReturnType<typeof searchProducts>) => result.items.map((item) => item.id);

describe("product search", () => {
  it("matches all tokens, ignores case, and searches keyword metadata", () => {
    expect(ids(searchProducts(catalog, query("q=IPHONE+17+pro")))).toEqual(["c", "a", "b", "d", "f"]);
    expect(ids(searchProducts(catalog, query("q=pro+max")))).toEqual(["a"]);
  });

  it("combines brand, search terms and inclusive price bounds", () => {
    const result = searchProducts(catalog, query("q=iphone&brand=apple&min=100&max=200"));
    expect(ids(result)).toEqual(["c", "a"]);
    expect(result.total).toBe(2);
  });

  it("distinguishes a zero maximum from an absent price bound", () => {
    expect(ids(searchProducts(catalog, query("max=0")))).toEqual(["f"]);
    expect(searchProducts(catalog, query()).total).toBe(6);
  });

  it("preserves recommendation order and uses IDs for equal-price ties", () => {
    expect(ids(searchProducts(catalog, query("q=iphone")))).toEqual(["c", "a", "b", "d", "f"]);
    expect(ids(searchProducts(catalog, query("q=iphone&sort=price-asc")))).toEqual(["f", "a", "b", "c", "d"]);
    expect(ids(searchProducts(catalog, query("q=iphone&sort=price-desc")))).toEqual(["d", "c", "a", "b", "f"]);
  });

  it("returns only relevant facets after applying every selected condition", () => {
    const result = searchProducts(catalog, query("q=iphone&brand=Apple&min=100&max=200"));
    expect(result.brands).toEqual([{ value: "Apple", count: 2 }]);
    expect(result.categories).toEqual([{ value: "手機", count: 2 }]);
  });

  it.each(["q=does-not-exist", "brand=unknown", "category=unknown", "min=999"])("returns an empty first page for %s", (value) => {
    const result = searchProducts(catalog, query(value + "&page=99"));
    expect(result).toMatchObject({ items: [], total: 0, page: 1, pageSize: 12 });
    expect(result.brands).toEqual([]);
    expect(result.categories).toEqual([]);
  });

  it("narrows category and brand choices through search, category selection and brand selection", () => {
    const initial = query("q=iphone");
    expect(searchProducts(catalog, initial).categories).toEqual([{ value: "手機", count: 2 }, { value: "手機配件", count: 3 }]);
    const accessories = updateSearchQuery(initial, { category: "手機配件" });
    const byCategory = searchProducts(catalog, accessories);
    expect(ids(byCategory)).toEqual(["b", "d", "f"]);
    expect(byCategory.brands).toEqual([{ value: "UAG", count: 1 }, { value: "HODA", count: 1 }, { value: "RHINOSHIELD", count: 1 }]);
    const byBrand = updateSearchQuery(accessories, { brand: "HODA" });
    expect(ids(searchProducts(catalog, byBrand))).toEqual(["d"]);
    expect(searchProducts(catalog, byBrand).brands).toEqual([{ value: "HODA", count: 1 }]);
    expect(ids(searchProducts(catalog, updateSearchQuery(byBrand, { brand: "" })))).toEqual(["b", "d", "f"]);
    expect(ids(searchProducts(catalog, clearSearchFilters(byBrand)))).toEqual(["c", "a", "b", "d", "f"]);
  });

  it("changes available facets with the keyword instead of listing the full catalog", () => {
    const result = searchProducts(catalog, query("q=pro+max"));
    expect(result.brands).toEqual([{ value: "Apple", count: 1 }]);
    expect(result.categories).toEqual([{ value: "手機", count: 1 }]);
  });

  it("does not change facet order when sorting products by price", () => {
    expect(searchProducts(catalog, query("sort=price-asc")).brands).toEqual(searchProducts(catalog, query()).brands);
  });

  it("paginates after filtering and sorting, and clamps oversized pages", () => {
    const many = Array.from({ length: 25 }, (_, index) => product(String(index + 1).padStart(2, "0"), index + 1));
    const second = searchProducts(many, query("sort=price-desc&page=2"));
    expect(second.total).toBe(25);
    expect(second.items.map((item) => item.price)).toEqual([13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
    expect(second.page).toBe(2);
    const last = searchProducts(many, query("sort=price-desc&page=999"));
    expect(last.page).toBe(3);
    expect(ids(last)).toEqual(["01"]);
    expect(searchProducts(many, query("min=20&page=2"))).toMatchObject({ total: 6, page: 1 });
  });

  it("does not mutate the catalog, product objects, or query", () => {
    const frozen = Object.freeze(catalog.map((item) => Object.freeze({ ...item })));
    const input = Object.freeze(query("sort=price-desc"));
    const before = JSON.stringify({ frozen, input });
    searchProducts(frozen, input);
    expect(JSON.stringify({ frozen, input })).toBe(before);
  });
});
