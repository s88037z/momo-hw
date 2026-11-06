import type { Product } from "@/features/products/types";

const models = [
  { brand: "Apple", name: "iPhone 17 Pro 256GB（6.3吋）", price: 37400, image: "iphone-17-pro" },
  { brand: "Apple", name: "iPhone 17 Pro Max 256GB（6.9吋）", price: 41900, image: "iphone-17-pro-max" },
  { brand: "UAG", name: "iPhone 17 Pro 磁吸耐衝擊雙件式保護殼", price: 1490, image: "uag-case" },
  { brand: "RHINOSHIELD", name: "iPhone 17 Pro Clear 抗黃化磁吸防摔手機殼", price: 980, image: "rhinoshield-case" },
  { brand: "HODA", name: "iPhone 17 Pro AR抗反射滿版玻璃保護貼", price: 690, image: "hoda-screen-protector" },
  { brand: "HODA", name: "iPhone 17 Pro MagSafe 幻石心心相遇保護殼", price: 1490, image: "hoda-heart-case" },
];

// Fixed demo offers, not live prices, actual bundles, or randomized data.
export const products: Product[] = models.flatMap((model, modelIndex) =>
  ["標準款", "精選組", "超值組", "限定組"].map((edition, editionIndex) => ({
    id: `product-${String(modelIndex * 4 + editionIndex + 1).padStart(2, "0")}`,
    name: `【${model.brand}】${model.name} ${edition}`,
    brand: model.brand,
    category: modelIndex < 2 ? "手機" : "手機配件",
    keywords: ["iphone", "17", "pro", "手機", model.brand.toLowerCase()],
    image: `/images/products/${model.image}.webp`,
    price: model.price + editionIndex * 100,
    originalPrice: model.price + 1000,
    rating: 4 + (editionIndex % 3) * 0.5,
    reviewCount: 8 + modelIndex * 7 + editionIndex,
    salesCount: 100 + modelIndex * 100 + editionIndex * 10,
    promotion: modelIndex < 2 ? "滿1件折2500" : "限時優惠・登記送mo點",
    campaignLabel: editionIndex % 2 === 0 ? "登記抽\n999\nmo點" : "登記送\n1,100\nmo點",
    fastDelivery: modelIndex < 4,
  })),
);
