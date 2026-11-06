import type { Product } from "@/features/products/types";

const models = [
  { brand: "Apple", name: "iPhone 17 Pro 256GB", price: 37400 },
  { brand: "Apple", name: "iPhone 17 Pro Max 256GB", price: 41900 },
  { brand: "UAG", name: "iPhone 17 Pro 耐衝擊保護殼", price: 1490 },
  { brand: "RHINOSHIELD", name: "iPhone 17 Pro 防摔手機殼", price: 980 },
  { brand: "HODA", name: "iPhone 17 Pro 螢幕保護貼", price: 690 },
  { brand: "Apple", name: "iPhone 17 Pro 矽膠保護殼", price: 1690 },
];

// Fixed fixtures, not live prices or randomized data. Four variants of six models.
export const products: Product[] = models.flatMap((model, modelIndex) =>
  ["黑色", "白色", "橘色", "藍色"].map((color, colorIndex) => ({
    id: `product-${String(modelIndex * 4 + colorIndex + 1).padStart(2, "0")}`,
    name: `【${model.brand}】${model.name}（${color}）`,
    brand: model.brand,
    keywords: ["iphone", "17", "pro", "手機", model.brand.toLowerCase()],
    image: "/images/product-placeholder.svg",
    price: model.price + colorIndex * 100,
    originalPrice: model.price + 1000,
    rating: 4 + (colorIndex % 3) * 0.5,
    reviewCount: 8 + modelIndex * 7 + colorIndex,
    salesCount: 100 + modelIndex * 100 + colorIndex * 10,
    promotion: modelIndex < 2 ? "登記送 mo 點" : "限時優惠",
  })),
);
