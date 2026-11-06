# 03：URL 查詢、業務邏輯與 Vitest

- 日期：2026-11-06；實作與驗證：18:34–18:47（Asia/Taipei），約 13 分鐘。
- 人工 review 後補上分類／動態 Facets：19:00–19:07，約 7 分鐘。
- Review 狀態：已核可提交，包含分類／動態 Facets 的人工 review 修正。

## Scope 與變更

- 接通搜尋、分類／品牌選取及取消、價格確認、價格升降序、分頁與清除篩選；URL 為已套用條件的來源，支援直接進入、重新整理及瀏覽器返回。
- 建立共用參數解析／序列化、價格驗證與條件轉換；建立搜尋／排序／分頁純函式，由 MSW handler 呼叫，HTTP 邊界延續一般 `fetch`。
- 顯示非法價格與空結果狀態；修正無效 URL 參數與超界頁碼。Query Key 包含完整正規化條件，fetch 保留 AbortSignal。
- 加入 Vitest、Node 測試設定與 `test`／`test:watch` 指令；初版 45 個案例，分類修正後為 51 個。沒有加入 Playwright 或 RTL。

## 技術選擇與 Tradeoff

- **事前決策**：使用者確認先實作查詢業務邏輯與 Vitest，搜尋頁完成後再加入 Playwright E2E。
- **責任邊界**：`features/products/search-params.ts` 定義共用查詢合約，`search-products.ts` 處理純運算；`features/search/use-search-state.ts` 負責 Next.js URL 導航，呈現元件維持 props／callback。不加入 nuqs、Zustand 或通用 schema 引擎。
- **導航**：一般條件變更以 `push` 保留歷程，正規化與頁碼修正以 `replace` 避免增加無效歷程。搜尋／價格只在送出時套用，沒有每次輸入即發送查詢或 debounce。
- **草稿**：以正規化 URL 作為內層容器的 key，URL 改變時重建未送出的搜尋／價格草稿，避免返回後殘留先前輸入；代價是該容器重新掛載，未保留焦點及未送出的草稿。Query Client 留在外層，快取不因此清除。
- **載入**：先顯示明確的載入狀態，不使用上一份商品作 placeholder；導航期間停用查詢控制項，降低重複操作覆蓋條件的風險。
- **分類／數量修正**：原先分類只有摘要、品牌選項保留整個 catalog，與實際操作真站的搜尋流程有落差。經使用者確認，補上 `category` URL 參數及單選互動；Facet 改為全部已套用條件的交集（Conjunctive Faceting），移除不相關零筆選項。選取後只保留符合的分類／品牌，可取消再選；若無結果，UI 保留可移除的已選項。Facet 在商品排序與分頁前計算，排序不影響選項順序。
- **範圍**：沿用「手機／手機配件」單層 Mock 分類，沒有複製真站 `cateLevel` 分類樹、品牌系列或其他進階屬性。呈現元件改名 `search-filters.tsx`，由私有 `FacetRow` 共用分類與品牌的選取呈現，不引入通用 Plugin 系統。
- **數值**：價格以文字輸入搭配 decimal 鍵盤提示，讓無效字串可由共用規則驗證，而非被 number input 默默清空。接受零、小數與有限科學記號，拒絕負數、非有限值、十六進位及超出安全範圍的值。非法 URL 價格範圍整組略過並正規化；表單非法輸入則顯示提示，不修改 URL 或結果。

## 驗證

- `pnpm test`：2 個測試檔、51 個案例通過。使用獨立小型資料與明確預期值驗證組合篩選、含端點價格、同價 ID 排序、推薦順序、分類／品牌動態選項、分頁、超界頁碼、空結果與不修改輸入；另測 URL 編碼、正規化、零值、分類取消與頁碼重設。
- `pnpm run typecheck`、`pnpm run lint`、`pnpm run build`：通過，搜尋頁仍為靜態輸出，`useSearchParams` 有 Suspense 邊界。
- 靜態版 Chrome 抽查：組合網址 HODA＋1,000–1,800＋價格降序為 4 筆（1,790／1,690／1,590／1,490）；僅價格區間為 11 筆（UAG 4、犀牛盾 3、HODA 4）；空查詢結果為 0 筆；非法範圍／排序與 page=999 修正後為第 2 頁。
- 實際送出非法價格，確認 URL 與原 12 筆結果不變；再套用價格、品牌、排序，確認返回與重新整理後恢復已套用條件。9 次 API 回應皆為 200 且來自 Service Worker，無瀏覽器錯誤或外部 HTTP 請求。
- 已查看 [初版組合查詢畫面](assets/03-query-results.png)；該圖保留作為分類修正前的紀錄。
- 修正後靜態版實際操作：「手機」24 筆、兩個分類／四個品牌 → 從第 2 頁選「手機配件」16 筆、三個品牌且頁碼重設 → 選 HODA 8 筆、品牌只顯示 HODA。返回與重新整理可還原；改搜 UAG 僅出現手機配件與 UAG；未知分類零結果仍可取消並恢復 8 筆。
- 已查看 [修正後分類與品牌畫面](assets/03-category-filters.png)，沒有瀏覽器錯誤、外部 HTTP 請求或水平溢出。上述是瀏覽器抽查，尚非納入 repo 的 Playwright E2E suite；完整 E2E、競態與錯誤復原留待後續驗證批次。

## 人工 Review

- 優先讀兩個 `search-*.test.ts`，確認業務預期；再看 `search-params.ts`、`search-products.ts` 與精簡後的 MSW handler。
- UI 接線重點：`use-search-state.ts` 的 push／replace 邊界、`search-results.tsx` 的草稿重置與 Query Key，以及價格錯誤提示。
- 使用者要求比較真站的「手機 → 分類 → 品牌」行為，確認缺少分類互動與動態選項後，同意補上最小功能；修正並補測後，使用者回覆「好 ok 可以 commit」，核可本批提交。
- 依序拆成查詢規則與 Vitest、URL 與篩選整合、文件與驗證紀錄三筆 Conventional Commits；保留 Codex 協作 trailer 與實際提交時間，不將 review 後整理的提交回填成實作時段。
