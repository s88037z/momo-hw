# 04：搜尋閉環評估、Playwright E2E 與交付文件

- 日期：2026-11-06；實作與驗證：19:10–19:19（Asia/Taipei），約 9 分鐘。
- Review 狀態：已核可提交。

## 閉環評估與 Scope

在已約定的「單頁 Mock 搜尋」範圍內，輸入與套用、分類／品牌連動、價格驗證、排序、分頁、清除、URL 還原、零結果及 API 失敗重試均有對應行為，未發現必須增加功能才能交付的阻斷缺口。本批聚焦驗證證據與可重現性，沒有新增業務功能。

- 加入 Playwright Test、五個 E2E、獨立靜態預覽設定與執行／報告指令。
- 對 build 產生的 `out/` 測試，保留 MSW 與既有查詢規則；不重用日常開發伺服器。
- 重寫 README：範圍、架構、技術選擇與代價、啟動／驗證、真站差異、AI 協作及演進方向。
- 將使用者提供的原始參考圖原樣複製到 `docs/reference/`，避免 reviewer 無法取得被忽略的 `.ai` 內容。

## 技術選擇與 Tradeoff

- E2E 限定一種桌面瀏覽器、單 worker、零自動重試，以小型可讀案例驗證閉環。預設使用 Playwright Chromium，本次實際使用已安裝的 Chrome，節省額外下載時間；標準安裝方式已寫入 README。
- 啟用 Service Worker，首個查詢及重試均確認 `fromServiceWorker()`；不使用 page.route 的固定成功回應繞過業務邏輯。錯誤案例只注入一次 fetch 503，重試恢復 MSW。
- 使用可存取的 label／role 及既有商品卡 test ID，避免固定 sleep 或依賴畫面座標。檢查實際商品、價格、數量與 URL，而非只有「元素出現」。
- 失敗保留 trace、截圖與 HTML report；每個案例監看未處理 JS 例外與外部 HTTP 請求。產物由 `.gitignore` 排除，測試源碼及指令納入交付。

## 驗證結果

- `pnpm test`：51 個 Vitest 案例通過。
- `pnpm run lint`、`pnpm run typecheck`、production build：通過。
- `PLAYWRIGHT_CHANNEL=chrome pnpm exec playwright test`：對已建置的靜態輸出，五個案例全部通過；`pnpm test:e2e` 會先執行 build 再跑相同測試。

| E2E | 覆蓋的交付行為 |
| --- | --- |
| 組合查詢 | 關鍵字、品牌、價格交集，實際商品與降序價格，MSW 回應 |
| 分類／品牌 | 選項收斂、分類切換重設頁碼、清除條件保留關鍵字 |
| URL／分頁 | 直接網址、重新整理、返回／前進、超界頁碼與非法參數修正 |
| 驗證與零結果 | 非法草稿不套用、零結果後修改關鍵字恢復、移除未知分類 |
| 失敗復原 | 一次 503 顯示錯誤，使用者重試後回到真實 MSW 資料流程 |

第一輪有兩個案例因 Next.js 的 route announcer 同樣使用 alert role 而定位歧義；依失敗 trace 將查詢限制在 main 後通過。這是測試定位修正，沒有改變產品行為來遷就測試。

驗證限制：只實際跑 macOS＋Chrome，未另測標準 Chromium、Firefox／WebKit；沒有完整無障礙或視覺回歸基準，也尚未自動測 Worker 註冊失敗及所有競態。這些列為後續品質工作，不宣稱 production-ready。

## 依題目再次評估

| 評估面向 | 本次證據與下一步 |
| --- | --- |
| Delivery Quality | 鎖定版本、可重跑的 build／unit／E2E、錯誤復原、可提交的視覺參考；下一步接入 CI 自動執行並保存報告。 |
| Maintainability | URL／草稿／Query 責任分離、純函式與 HTTP 邊界、容器／呈現元件分工；增加 schema 或狀態工具前以實際規模決定。 |
| 真站差異與 Tradeoff | README 明列單層分類、有限語料、縮減篩選與載入／焦點取捨；沒有以更多路由掩蓋品質問題。 |
| AI／Agent 協作 | 四批 scope、人工決策、實際真站 review 修正、測試及 Co-authored Git history；README 分析了測試正確仍可能漏需求的案例。 |
| Validation／Observability | Vitest＋production 靜態版 E2E、穩定資料、可分享 URL、失敗 trace／截圖與例外／外部請求檢查；未為 Bonus 額外加入監控服務。 |

後續優先強化 CI，以及焦點保留、載入版面穩定與慢請求／Worker 啟動失敗測試；本次不增加商品詳情或購物車。

## 人工 Review

優先看 `e2e/search.spec.ts` 的五個使用者情境、`playwright.config.ts` 的靜態輸出與 MSW 設定，以及 README 的範圍、技術理由和限制是否符合交付期待。使用者回覆「ok 可以 commit」，核可本批提交。

依序拆成 Playwright E2E／測試設定與 README／交付紀錄兩筆 Conventional Commits，保留 Codex co-author trailer 與實際提交時間。
