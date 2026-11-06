import { expect, test } from "@playwright/test";

let browserErrors: string[];
let externalRequests: string[];

test.beforeEach(async ({ page, baseURL }) => {
  browserErrors = [];
  externalRequests = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("request", (request) => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(baseURL!).origin) {
      externalRequests.push(request.url());
    }
  });
});

test.afterEach(() => {
  expect(browserErrors, "no unhandled application exceptions").toEqual([]);
  expect(externalRequests, "demo must use local API and image resources").toEqual([]);
});

test("combines keyword, brand, price and descending price order through MSW", async ({ page }) => {
  const responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === "/api/products");
  await page.goto("/search/?q=iphone&brand=HODA");
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  expect(response.fromServiceWorker()).toBe(true);
  await expect(page.getByTestId("product-card")).toHaveCount(8);
  await page.getByLabel("最低價格", { exact: true }).fill("1000");
  await page.getByLabel("最高價格", { exact: true }).fill("1800");
  await page.getByRole("button", { name: "確認", exact: true }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(4);
  await page.getByRole("button", { name: "價格 高→低", exact: true }).click();
  await expect(page.getByTestId("product-card").locator("p.text-momo-price")).toHaveText([
    /\$\s*1,790/, /\$\s*1,690/, /\$\s*1,590/, /\$\s*1,490/,
  ]);
  await expect(page).toHaveURL((url) => url.searchParams.get("brand") === "HODA" && url.searchParams.get("min") === "1000" && url.searchParams.get("sort") === "price-desc");
  for (const card of await page.getByTestId("product-card").all()) {
    await expect(card.getByRole("heading")).toContainText("HODA");
  }
});

test("narrows categories and brands, resets page, and clears filters without clearing the keyword", async ({ page }) => {
  await page.goto("/search/?q=手機&page=2");
  const categories = page.getByRole("group", { name: "分類篩選", exact: true });
  const brands = page.getByRole("group", { name: "品牌篩選", exact: true });
  await expect(categories.getByRole("button")).toHaveCount(2);
  await expect(brands.getByRole("button")).toHaveCount(4);
  await categories.getByRole("button", { name: /^分類 手機配件/ }).click();
  await expect(page).toHaveURL((url) => url.searchParams.get("category") === "手機配件" && !url.searchParams.has("page"));
  await expect(brands.getByRole("button")).toHaveCount(3);
  await expect(page.getByRole("status").filter({ hasText: /共\s*16\s*件商品/ })).toBeVisible();
  await brands.getByRole("button", { name: /^品牌 HODA/ }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(8);
  await expect(brands.getByRole("button")).toHaveCount(1);
  await page.getByRole("button", { name: "清除篩選", exact: true }).click();
  await expect(page).toHaveURL((url) => url.searchParams.get("q") === "手機" && !url.searchParams.has("category") && !url.searchParams.has("brand"));
  await expect(brands.getByRole("button")).toHaveCount(4);
  await expect(page.getByTestId("product-card")).toHaveCount(12);
});

test("restores pages through reload, back and forward, and normalizes an oversized page", async ({ page }) => {
  await page.goto("/search/?q=iphone");
  const cards = page.getByTestId("product-card");
  await expect(cards.first().getByRole("heading")).toContainText("Apple");
  await page.getByRole("navigation", { name: "搜尋結果分頁", exact: true }).first().getByRole("button", { name: "下一頁", exact: true }).click();
  await expect(page).toHaveURL((url) => url.searchParams.get("page") === "2");
  await expect(cards.first().getByRole("heading")).toContainText("RHINOSHIELD");
  await page.reload();
  await expect(cards).toHaveCount(12);
  await expect(cards.first().getByRole("heading")).toContainText("RHINOSHIELD");
  await page.goBack();
  await expect(page).toHaveURL((url) => !url.searchParams.has("page"));
  await expect(cards.first().getByRole("heading")).toContainText("Apple");
  await page.goForward();
  await expect(cards.first().getByRole("heading")).toContainText("RHINOSHIELD");
  await page.goto("/search/?q=iphone&page=999&sort=unknown&min=200&max=100");
  await expect(page).toHaveURL((url) => url.searchParams.get("page") === "2" && !url.searchParams.has("sort") && !url.searchParams.has("min"));
  await expect(cards).toHaveCount(12);
});

test("rejects invalid price drafts, recovers from no results, and removes an unknown category", async ({ page }) => {
  await page.goto("/search/?q=iphone");
  await expect(page.getByTestId("product-card")).toHaveCount(12);
  const originalURL = page.url();
  await page.getByLabel("最低價格", { exact: true }).fill("2000");
  await page.getByLabel("最高價格", { exact: true }).fill("1000");
  await page.getByRole("button", { name: "確認", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("最低價不可高於最高價");
  expect(page.url()).toBe(originalURL);
  await expect(page.getByTestId("product-card")).toHaveCount(12);
  await page.getByLabel("搜尋商品", { exact: true }).fill("does-not-exist");
  await page.getByLabel("搜尋商品", { exact: true }).press("Enter");
  await expect(page.getByRole("heading", { name: "找不到符合條件的商品" })).toBeVisible();
  await expect(page.getByTestId("product-card")).toHaveCount(0);
  await page.getByLabel("搜尋商品", { exact: true }).fill("");
  await page.getByLabel("搜尋商品", { exact: true }).press("Enter");
  await expect(page.getByTestId("product-card")).toHaveCount(12);
  await page.goto("/search/?q=手機&category=不存在&brand=HODA");
  await expect(page.getByRole("heading", { name: "找不到符合條件的商品" })).toBeVisible();
  await page.getByRole("button", { name: "取消分類 不存在 篩選", exact: true }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(8);
  await expect(page).toHaveURL((url) => !url.searchParams.has("category") && url.searchParams.get("brand") === "HODA");
});

test("recovers from one failed fetch by retrying the real MSW query", async ({ page }) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);
    let failed = false;
    window.fetch = (input, init) => {
      const url = input instanceof Request ? input.url : String(input);
      if (!failed && new URL(url, location.href).pathname === "/api/products") {
        failed = true;
        return Promise.resolve(new Response("temporary failure", { status: 503 }));
      }
      return originalFetch(input, init);
    };
  });
  await page.goto("/search/?q=iphone");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("商品暫時無法載入");
  const responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === "/api/products");
  await page.getByRole("button", { name: "重試", exact: true }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  expect(response.fromServiceWorker()).toBe(true);
  await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);
  await expect(page.getByTestId("product-card")).toHaveCount(12);
});
