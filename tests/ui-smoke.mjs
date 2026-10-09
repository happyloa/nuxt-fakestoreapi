import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";

// Run against a production preview with access to the public Fake Store API.
const base = process.env.UI_TEST_URL || "http://127.0.0.1:3008";
const output = ".cache/ui-screenshots";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.UI_BROWSER_CHANNEL
    ? { channel: process.env.UI_BROWSER_CHANNEL }
    : {}),
});

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1050 },
    locale: "zh-TW",
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" || /hydration/i.test(message.text()))
      errors.push(message.text());
  });
  const screenshot = (name) =>
    page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
  const audit = async (name) => {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const violations = results.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      nodes: nodes.map(({ target, failureSummary }) => ({
        target,
        failureSummary,
      })),
    }));
    writeFileSync(
      `${output}/axe-${name}.json`,
      JSON.stringify(violations, null, 2),
    );
    assert.deepEqual(violations, [], `${name}: accessibility violations`);
    console.log(`${name}: accessibility passed`);
  };
  const checkWidths = async (name) => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1050 });
      // Chrome can report the previous layout during the first resize frame.
      await page.waitForFunction(
        () => document.documentElement.scrollWidth <= innerWidth,
        undefined,
        { timeout: 3000 },
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${name}: ${width}px overflow`,
      );
      if (width === 320) {
        for (const image of await page.locator("main img").all()) {
          await image.scrollIntoViewIfNeeded();
        }
        await page.waitForFunction(() =>
          [...document.querySelectorAll("main img")].every(
            (img) => img.complete && img.naturalWidth > 0,
          ),
        );
        await page.evaluate(() => scrollTo(0, 0));
        await screenshot(`${name}-zh-320`);
      }
    }
  };
  const loadCatalogImages = async () => {
    const cards = page.locator("#catalog article");
    for (let index = 0; index < (await cards.count()); index += 4) {
      await cards.nth(index).scrollIntoViewIfNeeded();
    }
    await cards.last().scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [...document.querySelectorAll("#catalog img")].every(
        (img) => img.complete && img.naturalWidth > 0,
      ),
    );
    await page.evaluate(() => scrollTo(0, 0));
  };

  assert.equal(
    (await page.goto(base, { waitUntil: "networkidle" })).status(),
    200,
  );
  await page.locator("#catalog article").first().waitFor();
  assert.equal(await page.locator("#catalog article").count(), 20);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page.evaluate(() =>
      [...document.fonts].some(
        (font) => font.family === "Manrope" && font.status === "loaded",
      ),
    ),
    true,
    "Bundled Manrope font loaded",
  );
  await checkWidths("home");
  await loadCatalogImages();
  await screenshot("home-desktop");
  await audit("home-light");

  await page.goto(`${base}/product/1`, { waitUntil: "networkidle" });
  await page
    .getByRole("heading", {
      name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      exact: true,
    })
    .waitFor();
  await checkWidths("product");
  await screenshot("product-desktop");
  await audit("product");
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "飾品", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelectorAll("#catalog article").length === 4,
  );
  await page.waitForURL(/category=/);
  await page.getByLabel("搜尋", { exact: true }).fill("no-product-matches");
  await page.getByText("找不到符合條件的商品", { exact: true }).waitFor();
  await page.getByRole("button", { name: "清除篩選", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelectorAll("#catalog article").length === 20,
  );
  await page.getByLabel("排序方式", { exact: true }).selectOption("desc");
  const cartProductName = (
    await page.locator("#catalog article h3").first().textContent()
  ).trim();
  await page.getByRole("button", { name: /^將「/ }).first().click();
  await page.getByRole("link", { name: "購物車 (1)", exact: true }).click();
  await page.getByRole("heading", { name: "購物車", exact: true }).waitFor();
  await page.getByRole("button", { name: /^增加「/ }).click();
  await page.getByRole("link", { name: "購物車 (2)", exact: true }).waitFor();
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("link", { name: "購物車 (2)", exact: true }).waitFor();
  await checkWidths("cart");
  await screenshot("cart-desktop");
  await audit("cart");
  console.log("Filters, sorting and persisted cart passed");

  await page.getByRole("button", { name: "示範結帳", exact: true }).click();
  await page
    .getByRole("heading", { name: "登入示範帳號", exact: true })
    .waitFor();
  await checkWidths("login");
  await screenshot("login-desktop");
  await audit("login");
  await page.getByRole("button", { name: "登入", exact: true }).click();
  await page.waitForURL(/\/cart(?:\?|$)/);
  await page.getByRole("link", { name: "購物車 (2)", exact: true }).waitFor();
  await page.getByRole("button", { name: "示範結帳", exact: true }).click();
  await page.getByText("示範結帳已完成", { exact: true }).waitFor();
  await page.getByRole("link", { name: "我的帳號", exact: true }).click();
  await page.getByRole("heading", { name: "我的帳號", exact: true }).waitFor();
  await page.getByText(cartProductName, { exact: true }).waitFor();
  await checkWidths("account");
  await screenshot("account-desktop");
  await audit("account");
  console.log("Login redirect, demo checkout and receipt passed");

  for (const [path, name] of [
    ["/products/new", "new-product"],
    ["/users", "users"],
  ]) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await checkWidths(name);
    await screenshot(`${name}-desktop`);
    await audit(name);
  }
  await page.goto(`${base}/api`, { waitUntil: "networkidle" });
  await checkWidths("api");
  await audit("api-products");
  await page.getByRole("tab", { name: /購物車/ }).click();
  await page.locator("#panel-carts").waitFor();
  await audit("api-carts");
  await page.getByRole("tab", { selected: true }).press("ArrowRight");
  assert.equal(
    await page.locator("#tab-users").getAttribute("aria-selected"),
    "true",
  );
  await screenshot("api-desktop");
  await audit("api-users");

  await page.goto(base, { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "切換深淺色主題", exact: true })
    .click();
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("dark"),
  );
  await loadCatalogImages();
  await screenshot("home-dark");
  await audit("home-dark");
  await page.getByRole("button", { name: /切換語言/ }).click();
  await page.waitForURL(/\/en(?:\?|$)/);
  await screenshot("home-english");
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("button", { name: "Toggle navigation", exact: true })
    .click();
  assert.equal(
    await page.locator("#site-navigation-mobile").evaluate((node) => node.open),
    true,
  );
  await screenshot("mobile-menu");
  await page
    .getByRole("button", { name: "Close navigation menu", exact: true })
    .press("Escape");
  assert.equal(
    await page.locator("#site-navigation-mobile").evaluate((node) => node.open),
    false,
  );
  await page
    .getByRole("button", { name: "Toggle navigation", exact: true })
    .click();
  await page
    .locator("#site-navigation-mobile")
    .getByRole("button", { name: "Toggle site theme", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Close navigation menu", exact: true })
    .click();
  await loadCatalogImages();
  await screenshot("home-mobile");
  await audit("mobile");
  await page.setViewportSize({ width: 320, height: 700 });
  await page.waitForFunction(
    () => document.documentElement.scrollWidth <= innerWidth,
    undefined,
    { timeout: 3000 },
  );
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "English 320px overflow",
  );
  await screenshot("home-320");
  assert.deepEqual(errors, [], "Browser errors or hydration mismatches");
  writeFileSync(
    `${output}/browser-errors.json`,
    JSON.stringify(errors, null, 2),
  );

  // A 404 emits an expected network error in Chrome, after the error-free flow check.
  assert.equal(
    (
      await page.goto(`${base}/not-a-page`, { waitUntil: "networkidle" })
    ).status(),
    404,
  );
  await page.getByRole("heading", { name: "404", exact: true }).waitFor();
  await audit("404");
  console.log("Languages, themes, responsive navigation and 404 passed");
  console.log(
    `UI smoke passed. Screenshots and accessibility reports: ${output}`,
  );
} finally {
  await browser.close();
}
