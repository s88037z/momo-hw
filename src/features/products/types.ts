export type ProductSort = "recommended" | "price-asc" | "price-desc";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "手機" | "手機配件";
  keywords: string[];
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  promotion: string;
  campaignLabel: string;
  fastDelivery: boolean;
}

export interface ProductFacet {
  value: string;
  count: number;
}

export interface ProductSearchResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  brands: ProductFacet[];
  categories: ProductFacet[];
}
