export interface Product {
  id: string;
  name: string;
  brand: string;
  keywords: string[];
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  promotion: string;
}

export interface ProductSearchResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}
