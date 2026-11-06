import type { Product, ProductFacet, ProductSearchQuery, ProductSearchResponse } from "./types";

export const PRODUCTS_PER_PAGE = 12;

function facets(matches: readonly Product[], key: "brand" | "category"): ProductFacet[] {
  const counts = new Map<string, number>();
  for (const product of matches) counts.set(product[key], (counts.get(product[key]) ?? 0) + 1);
  return [...counts].map(([value, count]) => ({ value, count }));
}

export function searchProducts(catalog: readonly Product[], query: ProductSearchQuery): ProductSearchResponse {
  const terms = query.q.normalize("NFKC").toLocaleLowerCase("en").split(/\s+/).filter(Boolean);
  const baseMatches = catalog.filter((product) => {
    const text = [product.name, product.brand, ...product.keywords].join(" ").normalize("NFKC").toLocaleLowerCase("en");
    return terms.every((term) => text.includes(term))
      && (query.min === undefined || product.price >= query.min)
      && (query.max === undefined || product.price <= query.max);
  });
  const matches = baseMatches.filter((product) =>
    (!query.category || product.category === query.category)
    && (!query.brand || product.brand.toLowerCase() === query.brand.toLowerCase()),
  );
  // Facets reflect all applied conditions. Compute before sorting so option order stays stable.
  const brands = facets(matches, "brand");
  const categories = facets(matches, "category");
  if (query.sort !== "recommended") {
    matches.sort((a, b) => {
      const priceDifference = query.sort === "price-asc" ? a.price - b.price : b.price - a.price;
      return priceDifference || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    });
  }
  const total = matches.length;
  const page = Math.min(query.page, Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)));
  return {
    items: matches.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE),
    total,
    page,
    pageSize: PRODUCTS_PER_PAGE,
    brands,
    categories,
  };
}
