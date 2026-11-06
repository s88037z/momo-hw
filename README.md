# momo 搜尋頁 Take-home

參考 momo 購物網搜尋頁的純前端作業。使用 Next.js App Router、TypeScript、Tailwind CSS、TanStack Query 與 MSW；不呼叫 momo API。

目前為第 1 批：專案建置與 Mock HTTP 資料流程。`/search` 暫時顯示基本商品清單，尚未實作正式版面、URL 查詢條件、篩選、排序與分頁互動。

## 本地開發

```sh
nvm use
pnpm install --frozen-lockfile
pnpm dev
```

使用 `.nvmrc` 指定的 Node.js 24，以及 `packageManager` 指定的 pnpm 8.8.0。開啟 <http://localhost:3000/search?q=iphone+17+pro>。

## 驗證與靜態展示

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm preview
```

`build` 產生 `out/`，`preview` 以靜態伺服器提供該目錄。直接開啟 `/search/` 也應可載入商品。此專案使用靜態輸出，不使用 `next start`。部署時將 `out/` 放在 HTTPS 靜態主機；本機以 localhost 使用 HTTP 即可。

## Mock 設計

- `src/features/products/api.ts` 透過 `fetch('/api/products')` 讀取商品，由 TanStack Query 管理結果與非同步狀態。
- `src/mocks/handlers.ts` 使用 MSW 攔截請求，不需要真實 API server。第 1 批僅回傳固定的第一頁資料；查詢參數將在第 3 批實作。
- `src/mocks/provider.tsx` 等待 Worker 啟動後才掛載頁面，避免初次請求穿透至靜態主機。啟動失敗時顯示可重新載入的錯誤狀態。
- 開發及靜態展示版都啟用 MSW。這是展示的資料來源，不能以 `NODE_ENV === 'development'` 限制，否則部署後 API 會回傳 404。
- 24 筆資料由固定模板生成，價格、顏色、促銷均為示範內容，不代表真實商品資訊。第 1 批只有自製 SVG 佔位素材，商品圖片在視覺批次補上。
- `public/mockServiceWorker.js` 由 MSW CLI 產生並納入版控；更新 MSW 後以 `pnpm exec msw init public --save` 同步此檔案，不手動修改。

## 設計與協作紀錄

- [規劃、範圍與取捨](docs/search-page-plan.md)
- [每批實作及人工 Review 紀錄](docs/implement-steps/README.md)

每批完成驗證後等待人工 review；使用者明確同意後才 commit。
