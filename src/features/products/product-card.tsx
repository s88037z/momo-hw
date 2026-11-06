import Image from "next/image";
import type { Product } from "./types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <article className="min-w-0" data-testid="product-card">
      <div className="relative aspect-square bg-white">
        <Image src={product.image} alt={product.name} width={320} height={320} sizes="(max-width: 639px) 45vw, (max-width: 1023px) 23vw, 200px" priority={priority} className="h-full w-full object-contain" />
        <div className="campaign-flag absolute top-0 left-0 flex min-h-14 w-11 items-center justify-center bg-momo px-1 pt-1 pb-3 text-center text-[10px] leading-tight font-bold whitespace-pre-line text-white" aria-label={product.campaignLabel.replaceAll("\n", " ")}>{product.campaignLabel}</div>
      </div>
      <div className="mt-1 flex items-center overflow-hidden bg-[#eeeeee] text-[10px] leading-5">
        <span className="shrink-0 bg-[#d60000] px-1 font-bold text-white">今日限定</span>
        <span className="truncate px-1 text-[#555]">登記享加碼回饋</span>
      </div>
      <p className="mt-2 truncate text-xs text-[#e00000]">{product.promotion}</p>
      <h2 className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 font-normal" title={product.name}>{product.name}</h2>
      <p className="mt-1 flex items-baseline gap-0.5 whitespace-nowrap text-momo-price">
        <span className="text-sm">$</span><span className="text-[26px] leading-9 tracking-tight tabular-nums">{product.price.toLocaleString("zh-TW")}</span>
      </p>
      <p className="mb-1 text-[11px] text-[#999]">市售價 <s>${product.originalPrice.toLocaleString("zh-TW")}</s></p>
      <div className="flex items-center gap-1 text-sm">
        <span role="img" aria-label={`評分 ${product.rating}，滿分 5`} className="relative inline-block tracking-[1px] text-[#ddd]">
          <span aria-hidden="true">★★★★★</span>
          <span aria-hidden="true" className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-[#ffbd00]" style={{ width: `${product.rating / 5 * 100}%` }}>★★★★★</span>
        </span>
        <span className="text-xs text-[#999]">({product.reviewCount})</span>
      </div>
      <p className="mt-0.5 text-[11px]">總銷量 {product.salesCount.toLocaleString("zh-TW")}</p>
      <div className="mt-2 flex min-h-5 flex-wrap items-center gap-1 text-[10px]">
        {product.fastDelivery && <span className="bg-[#dc1919] px-1 font-bold text-white italic">速</span>}
        {product.fastDelivery && <span className="font-bold text-[#555]">momo速配</span>}
        <span className="border border-[#f4a7c5] px-1 text-momo">登記</span>
        <span className="border border-[#f4a7c5] px-1 text-momo">贈品</span>
      </div>
    </article>
  );
}
