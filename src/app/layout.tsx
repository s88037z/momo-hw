import type { Metadata } from "next";
import { AppProviders } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "商品搜尋｜momo 前端作業",
  description: "參考 momo 購物網搜尋頁製作的前端展示，使用固定 Mock 商品資料。",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
