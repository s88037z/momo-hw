# 01：專案基礎建置與 Mock HTTP 流程

- 日期：2026-11-06；實作及驗證：17:24–17:39（Asia/Taipei），約 15 分鐘；之後完成使用者 review。
- Review 狀態：已核可提交；依使用者要求拆成相關的小 commits。

## Scope 與變更

- 建立 Next.js App Router、TypeScript、Tailwind CSS、ESLint、靜態輸出設定與 Node 版本設定。
- 建立根頁入口與 `/search` 基本商品清單，接上 Query Provider、HTTP 呼叫、MSW Worker 與 24 筆固定 Mock 商品。
- 建立 build／typecheck／lint／preview 指令、啟動說明，並更新 plan 的 MSW 決策。
- 此批驗證資料流程，不製作正式商品卡與視覺版面，也尚未讀取 URL、篩選、排序或切換分頁；handler 暫回傳固定的第一頁 12 筆。

## 技術選擇與 Tradeoff

- **事前決策**：使用者明確選擇 MSW，並同意在開發及靜態展示版都啟用，取代原先的本地 Promise service。
- **資料邊界**：`fetch → /api/products → MSW handler → fixtures`，呼叫端不依賴 MSW；保留未來替換 API 的位置，不新增 Next.js API Route。
- **啟動順序**：Worker 準備好才掛載查詢元件，並共用啟動 Promise 避免 Strict Mode 重複啟動；代價是初始 HTML 顯示載入狀態，商品資料待瀏覽器載入。
- **快取**：固定 Mock 資料採無限 stale time，停用自動重試與焦點重新抓取；仍提供明確的手動重試。
- **環境**：目前 shell 預設 Node 18，不符合新版 Next.js 要求；使用本機已有的 Node 24 LTS，透過 `.nvmrc` 固定，不修改全域預設版本。使用者另確認統一使用 pnpm；沿用 pnpm 8.8.0 與既有 `pnpm-lock.yaml`，移除本批初始產生的 npm lockfile，避免兩份鎖檔分歧。
- **刻意延後**：Zustand、Server Components 資料查詢、Query hydration、完整搜尋演算法與真實商品素材。

## 驗證

- `pnpm run build`：通過，`/` 與 `/search` 均產生靜態頁面，包含 MSW Worker 檔案。
- `pnpm run typecheck`、`pnpm run lint`：通過，無 lint 警告。
- Chrome 全新 profile，1440 × 1000，分別檢查靜態 `out/` 與既有 localhost 開發伺服器：總數 24、第一頁 12 筆，`/api/products` 為 200，Chrome DevTools Protocol 確認 `fromServiceWorker: true`；無未處理例外、console error、失敗的未取消請求或外部 HTTP 請求。
- [靜態版畫面](assets/01-static-foundation.png)／[開發版畫面](assets/01-dev-foundation.png)。靜態版使用獨立臨時 HTTP 埠，避免與使用者已開啟的 3000 埠混淆；檢查結束已關閉自建伺服器與 Chrome，保留使用者的開發伺服器。
- 驗證中修正缺少 favicon 的 404。開發模式 Strict Mode 會取消首次掛載的請求，檢查器排除正常取消，仍確認後續請求成功；不是停用 Strict Mode 或忽略真正的失敗。
- 環境限制：Turbopack 在沙箱內因無法建立內部通訊埠而失敗，核准後於沙箱外 build 通過；開發版使用 localhost 避開 dev resource 的來源限制。
- 尚未驗證：Worker 註冊失敗、API 錯誤重試及完整查詢邊界情境；列入後續驗證批次。暫用文字清單及佔位素材，不代表正式畫面已還原。

## 人工 Review

- 建議先讀 `src/mocks/provider.tsx`、`browser.ts`、`handlers.ts`，確認啟動順序與 Mock 合約。
- 再讀 `src/features/products/types.ts`、`api.ts` 與 `src/app/providers.tsx`，檢查資料模型、HTTP 邊界與 Query 設定。
- 本批只需確認建置與資料流程；搜尋頁的正式外觀與 URL 行為分屬後續批次。
- 核可依據：使用者回覆「目前 ok」，並要求將本批切成相關的小 commits、遵循 commit convention。
- 提交方式：採 Conventional Commits，依序拆成 `chore(app)` 專案建置、`feat(mocks)` 資料整合、`docs` 設計與驗證紀錄；含 Codex 協作 trailer。
- 時間說明：這些 commits 是本批實作與人工 review 完成後整理提交，不代表實作過程逐次提交；保留實際提交時間，不回填或改寫成實作期間的時間。
