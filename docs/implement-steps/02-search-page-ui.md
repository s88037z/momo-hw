# 02：搜尋頁版面與商品卡

- 日期：2026-11-06；實作與驗證：17:54–18:04（Asia/Taipei），約 11 分鐘。
- Review 狀態：已核可提交；包含人工 review 提出的目錄結構調整。

## Scope 與變更

- 完成緊湊搜尋列、深灰分類導覽、麵包屑、分類摘要與品牌區、價格／排序列及上下分頁；未接線的查詢控制項停用，第 3 批再串 URL 與查詢行為。
- 新增 `ProductCard`：本地圖片、促銷旗標、兩行商品名稱、價格／原價、評分、銷量與配送標記。桌面六欄、390px 兩欄，保留基本中間寬度重排。
- 下載六張真站代表性商品圖，保留原始檔案並記錄來源；24 筆示範資料改為商品類型與圖片配對，組合與優惠仍為 Mock。
- API 增加由完整 fixtures 計算的分類／品牌數量，避免使用真站或僅第一頁的數字；handler 仍只回傳固定第一頁，不包含搜尋／篩選演算法。
- 更新 README 與 plan，反映目前進度及已確認的素材選擇。

## 技術選擇與 Tradeoff

- **事前決策**：使用者選擇「使用真站圖片並存本地、記錄來源」，取代持續使用佔位圖；沒有呼叫商品 API 取得資料。來源見 [素材紀錄](../asset-sources.md)。
- **版面**：沿用 Tailwind＋CSS Grid，依頁首、品牌篩選、工具列、分頁與商品卡分工；不新增 UI 套件或 Zustand。
- **元件介面**：篩選／排序／分頁以 props 與事件 callback 表達，缺少 callback 就停用，避免本批建立之後必須與 URL 同步的第二份狀態。商品資料仍由 Query 取得，呈現元件不匯入 Mock fixtures。
- **人工 review 調整**：`search-results.tsx` 留在 feature 根目錄，負責 Query 與頁面組合；四個呈現元件移至 `features/search/components/`。此時不增加 hooks／containers 等目錄或 barrel exports，保留簡單的直接 import。商品卡仍屬於 products feature。
- **資料模型**：增加分類、活動旗標與配送標記以支援商品卡；分類／品牌計數由 MSW 回傳，是呈現需求所需的最小合約擴充，不建立通用 Facet 引擎。
- **素材**：使用 `next/image`，靜態輸出維持 `unoptimized`，固定正方形與 `object-contain`；小型本地圖片不另加圖片處理服務。前六張優先載入，其餘延遲載入。

## 驗證

- `pnpm run build`、`pnpm run typecheck`、`pnpm run lint`：已通過；本批不為純視覺元件新增鏡像單元測試。
- 使用獨立靜態 HTTP 預覽與全新 Chrome profile：1440 × 1000 為六欄、390 × 844 為兩欄；兩者都是 12 張卡、總數 24，沒有頁面水平溢出或破圖，圖片皆為本地來源。
- `/api/products` 為 200，DevTools 確認 `fromServiceWorker: true`；無未處理例外、console error、失敗的未取消請求或外部 HTTP 請求。
- 已人工查看 [桌面截圖](assets/02-desktop.png) 與 [窄螢幕截圖](assets/02-mobile.png)。未將此視覺驗證當作搜尋互動或完整無障礙驗證；控制項行為、URL、空結果與錯誤情境留待後續批次。

## 人工 Review 與已知差異

- 優先檢查 `src/features/search` 的元件責任與 callback 介面、`src/features/products/product-card.tsx` 的呈現，以及 `src/mocks/handlers.ts` 的數量來源。
- 比對內容寬度、灰底條件區、粉紅排序態、六欄密度與商品卡資訊層級。依既定範圍縮減進階篩選列，商品區因此比原站提早出現；未製作瀏覽紀錄、購物車浮動欄、完整活動圖層或 momo 手機站。
- 搜尋框目前固定顯示 `iphone 17 pro`，控制項停用；這是尚待第 3 批接線的中間成果。沒有商品詳情頁，因此商品卡不偽裝成可點連結。
- 核可依據：使用者表示其他部分沒問題、可 commit，並建議將搜尋頁的子元件移到 `components/`；已依此整理目錄與 import，補做型別、lint 與 build 驗證。
- 提交方式：依序拆成商品卡／素材與資料、搜尋頁組合、文件與驗證證據三筆 Conventional Commits；保留 Codex 協作 trailer 與實際提交時間。
