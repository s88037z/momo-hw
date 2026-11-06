# momo 搜尋頁 Take-home

參考 momo 購物網搜尋頁的純前端作業。使用 Next.js App Router、TypeScript、Tailwind CSS、TanStack Query 與 MSW；不呼叫 momo API。

目前完成第 3 批：搜尋頁主要版面與 URL 驅動的關鍵字、分類、品牌、價格、排序及分頁互動，包含價格驗證、空結果、重新整理及瀏覽器返回還原。分類／品牌選項依目前條件動態產生。查詢業務邏輯以 Vitest 驗證；正式 Playwright E2E 尚待後續批次加入。

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
pnpm test
pnpm build
pnpm preview
```

`build` 產生 `out/`，`preview` 以靜態伺服器提供該目錄。直接開啟 `/search/` 也應可載入商品。此專案使用靜態輸出，不使用 `next start`。部署時將 `out/` 放在 HTTPS 靜態主機；本機以 localhost 使用 HTTP 即可。

## Mock 設計

- `src/features/products/api.ts` 透過 `fetch('/api/products')` 讀取商品，由 TanStack Query 管理結果與非同步狀態。
- `src/mocks/handlers.ts` 使用 MSW 攔截請求，不需要真實 API server；共用參數解析與查詢純函式，回傳實際篩選／排序／分頁後的資料。
- `src/mocks/provider.tsx` 等待 Worker 啟動後才掛載頁面，避免初次請求穿透至靜態主機。啟動失敗時顯示可重新載入的錯誤狀態。
- 開發及靜態展示版都啟用 MSW。這是展示的資料來源，不能以 `NODE_ENV === 'development'` 限制，否則部署後 API 會回傳 404。
- 24 筆資料由固定模板生成，價格、組合、評價與促銷均為示範內容，不代表真實商品資訊。六張代表性商品圖已下載至本地，來源見 [素材紀錄](docs/asset-sources.md)。
- `public/mockServiceWorker.js` 由 MSW CLI 產生並納入版控；更新 MSW 後以 `pnpm exec msw init public --save` 同步此檔案，不手動修改。

## 查詢與測試

URL 支援 `q / category / brand / min / max / sort / page`；`sort` 為 `recommended`、`price-asc` 或 `price-desc`，每頁固定 12 筆。空關鍵字顯示所有商品。搜尋及價格在送出時套用，其他條件改變時回到第一頁；清除篩選會保留關鍵字。

例如 `/search/?q=iphone&brand=HODA&min=1000&max=1800&sort=price-desc` 應顯示四件 HODA 商品，價格依序為 1,790、1,690、1,590、1,490。重新整理後輸入值與選取狀態應一致。

- `pnpm test`：51 個 Vitest 案例，於 Node 環境驗證價格與 URL 解析、序列化、條件轉換、搜尋、分類／品牌連動、Facet 計數、排序、分頁與不修改輸入資料。
- `pnpm test:watch`：開發時持續執行查詢規則測試。
- `src/features/products/search-params.ts` 是 UI 與 MSW 共用的查詢合約；`search-products.ts` 是不依賴 React 或 MSW 的業務邏輯。
- 分類與品牌 Facets 均反映全部已套用條件，並在分頁前計算；不列出不相關的零筆選項。選取後點擊「×」取消即可重新選擇；即使條件無結果，仍保留可移除的選取項。
- 可用「搜尋手機 → 手機配件 → HODA」驗證 24 → 16 → 8 筆的收斂；搜尋 UAG 則只顯示手機配件與 UAG。Mock 僅有單層分類，沒有真站完整分類樹與品牌系列。
- Vitest 不證明 UI 接線完整。本批已做靜態版瀏覽器抽查；可重跑的 Playwright E2E 測試留到下一批，不把截圖或抽查當作已交付 E2E suite。

## 設計與協作紀錄

- [規劃、範圍與取捨](docs/search-page-plan.md)
- [每批實作及人工 Review 紀錄](docs/implement-steps/README.md)

每批完成驗證後等待人工 review；使用者明確同意後才 commit。
