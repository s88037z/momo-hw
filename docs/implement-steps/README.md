# 實作步驟紀錄

每批 AI 實作完成後建立一份 `NN-short-name.md`，從 `01` 起依序編號。開始前先說明 scope 與驗收條件；尚未決定且影響架構、依賴、行為或範圍的技術選擇，先提出討論，再執行相關變更。

每份紀錄以一頁內為原則，重點是讓人工判斷程式與取捨，並保留實際決策證據。下方為格式，並非已完成的實作或驗證結果。

```markdown
# NN：本批名稱

- 日期／實作時間：
- Review 狀態：待 review／修正中／已核可提交（依實際回覆更新）

## Scope 與變更
- 本批目標、實際完成的行為與主要檔案。
- 與原定範圍的差異（若有）。

## 技術選擇與 Tradeoff
- 採用方案、理由與代價；有實際比較時再列替代方案。
- 事前需釐清的問題與使用者決定（若有）。

## 驗證
- 實際執行的命令／操作與結果，必要時連結截圖。
- 未驗證部分、已知限制或失敗；不能把預期結果寫成已通過。

## 人工 Review
- 建議檢查的檔案、操作路徑或技術決策。
- 使用者回饋、修正內容及再次驗證結果（收到後補上）。
- 核可依據（收到明確同意後補上，不預填）。
```

本批完成後，回覆簡述 scope、技術選擇、驗證與限制，附上紀錄連結並等待 review。有修正時更新同一份紀錄。使用者明確同意提交後，才 commit 本批已核可的程式與文件；其他 staged 變更不得一併提交。commit hash 於提交後回覆，不為補 hash 再修改同一個 commit。

## Commit Convention

採 Conventional Commits：`type(scope): description`，scope 視需要使用；標題以英文簡述單一目的，例如 `chore(app): bootstrap Next.js static frontend`、`feat(mocks): connect product queries through MSW`、`docs: record foundation decisions and validation`。

一批人工 review 可對應多個相關的小 commits，依依賴順序拆分，讓程式設定、功能整合與文件各自容易檢查。拆分時避免引入缺失的本地模組；已核可的同一批不須每筆重新詢問。AI 參與的提交保留 Codex co-author trailer，並如實記錄 review 後才拆分提交的情況，不改寫提交時間。

人工 review 與紀錄時間包含在 120 分鐘實作上限內，不因等待而暫停。時間不足時揭露並縮減範圍，不省略核可程序。流程依據見 [規劃文件第 7 節](../search-page-plan.md#7-每批實作人工-review-與-commit-流程)。
