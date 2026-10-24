# Storefront Lab

Storefront Lab 是以 [Fake Store API](https://fakestoreapi.com/) 為資料來源的 Nuxt 示範店面。它用一個可瀏覽、搜尋、篩選、加入購物車與登入的前台，示範如何把第三方 API 收斂在 Nuxt 的安全邊界內，而不是把 API 呼叫、登入狀態與畫面邏輯混在一起。

這不是正式電商系統，也不處理真實付款、出貨或訂單。Fake Store API 提供的是公開假資料；其新增、修改、刪除與購物車請求可能會回傳示範結果，但不代表資料會永久保存。請勿將此專案用於真實交易或輸入敏感資料。

## 功能範圍

- 商品目錄、分類、搜尋、排序與商品詳情
- 本機購物車、數量調整與示範結帳流程
- Fake Store API 登入與帳戶資料展示
- 繁體中文與 English 介面
- 深色模式、響應式版面與基本無障礙支援
- 公開假資料的 API 操作台與示範商品表單（CRUD 不會永久保存）

## 重要的資料與安全說明

- 商品、使用者與購物車資料皆來自 Fake Store API 的假資料。
- 訂單僅為示範收據；不會建立真實訂單，也不保證上游 API 的 mutation 會持久化。
- 購物車以瀏覽器本機儲存為主，讓示範流程在重新整理後仍可延續；它不是跨裝置同步的訂單系統。
- 前端不保存、顯示或回傳使用者密碼。登入資料只會用於向上游 API 建立工作階段。
- 上游 token 只在伺服器登入流程中短暫使用；BFF 會改寫為隨機、不透明的伺服器端 demo session，並以 `HttpOnly`、`Secure`、`SameSite=Lax` cookie 保存識別碼，瀏覽器 JavaScript 無法直接讀取或偽造使用者身分。示範 session 只留在目前伺服器程序的記憶體中，最多保留 10,000 筆；重新部署或重啟後會失效。

## 架構原則

這是一個 Nuxt 示範專案。頁面、元件與 Pinia store 處理介面，`server/api` 負責第三方 API 請求與登入，共用型別放在 `shared/types`。

```text
app/
  components/
    products/         # 目錄、篩選、商品卡與詳情
    cart/             # 購物車明細與摘要
    auth/             # 示範登入表單
    layout/           # Header、Footer、語言與主題控制
    api/              # 公開假資料操作台
  stores/             # Pinia 商品、購物車、session、主題與通知
  plugins/            # session 初始化、本機購物車還原與主題
  composables/        # URL query、SEO 與共用操作
  pages/              # 薄頁面層：路由、SEO、頁面組裝
  layouts/            # 應用程式殼層
  assets/css/         # Tailwind v4 CSS-first 主題與樣式
shared/types/         # 前後端共用 DTO，使用 #shared alias
i18n/                 # Nuxt i18n 的標準設定與語言檔目錄
server/
  api/               # 同源 BFF 端點
  utils/             # Fake Store upstream client、session cookie 與驗證
```

### BFF 邊界

瀏覽器只應呼叫本站的 `/api/*` 端點；由 Nitro server 代表前端呼叫 Fake Store API。BFF 負責：

- 驗證 query、request body 與上游回應。
- 將上游錯誤轉為一致且不洩漏細節的應用程式錯誤。
- 移除不該交給前端的欄位，例如密碼與原始 token。
- 管理不透明的 `HttpOnly` session cookie，以及登入、登出與目前使用者資料。
- `/api/playground/*` 只允許固定的 mock API 資源、方法與查詢，並移除回應內的密碼與 token。

這讓元件不需要知道第三方 API 的 URL、token 格式或錯誤細節，也能避免直接把上游資料模型散落在 UI 中。

### 前端資料流

- 商品與分類屬於可 SSR 的遠端資料，透過 `useAsyncData`／`useFetch` 取得並以明確 cache key 管理。
- 購物車、主題、通知與選單等純前端狀態才使用 client state。
- 篩選條件同步到 URL，便於重新整理、分享與返回瀏覽。
- 示範結帳只在本站建立收據，不對 Fake Store API 發送 mutation；這讓介面行為與上游的非持久化特性一致。
- 登入不載入上游的固定購物車；會保留訪客商品。每項最多 99 件、每車最多 50 項；結帳失敗保留商品，登出清空購物車與本次收據。

## 介面與可近用性

介面使用暖白底色、橄欖色主視覺與橘色操作按鈕。Manrope 字型與首頁背包圖片由本站提供；樣式使用 Tailwind v4，圖示採用共用 SVG 元件。

介面以語意化 HTML 與可重用的領域元件建立，並遵守下列原則：

- 可使用鍵盤操作導覽、表單、drawer、對話框與通知。
- 清楚的焦點樣式、跳至主要內容連結與正確的 ARIA 標示。
- 對 loading、空資料、錯誤與操作成功提供可理解的回饋。
- 尊重 `prefers-reduced-motion`，避免不必要的強制動畫。
- 提供繁體中文（預設）與 English；日期、貨幣與數量依 locale 格式化。

## 系統需求

- Node.js `^22.22.3 || ^24.15.0 || >=26.0.0`
- npm `12.2.1`（`packageManager` 指定的版本）

本機與 Pages 建置使用 `.node-version` 指定的 Node.js `24.21.0`。可先以 `node --version` 確認版本；Pages v3 不會依 `package.json` 的 `engines` 切換 Node 版本。

## 開始使用

```bash
npm install
```

啟動本機開發伺服器：

```bash
npm run dev
```

型別檢查：

```bash
npm run typecheck
```

建立正式版：

```bash
npm run build
```

預覽正式版：

```bash
npm run preview
```

## 設定與維護

複製 `.env.example` 為 `.env`，依環境設定：

- `NUXT_PUBLIC_SITE_URL`：正式公開網址，預設沿用專案原有的 `https://nuxt-fakestoreapi.worksbyaaron.com`，供 canonical、分享圖與語系連結使用；部署時應與 `NUXT_PUBLIC_I18N_BASE_URL` 設為相同網址。不要填 localhost。
- `NUXT_FAKE_STORE_API_BASE`：伺服器端上游位址。注意這是 Nitro 對 `fakeStoreApiBase` 的標準命名；原本 `NUXT_FAKESTORE_API_BASE` 無法在 production runtime 正確覆寫。

### Cloudflare Pages

既有 Pages 專案使用 GitHub 的 `main` 分支自動部署，設定如下：

| 設定 | 值 |
| --- | --- |
| Build command | `npm run build:cloudflare` |
| Build output directory | `dist` |
| Node version | `.node-version` 的 `24.21.0` |
| Production / preview compatibility flag | `nodejs_compat` |

`build:cloudflare` 在載入 Nuxt 設定前指定 Nitro 的 `cloudflare_pages` preset，產出 `dist/_worker.js` 與靜態資源。圖片以原生 `<img>` 載入，保留尺寸、替代文字與延遲載入。Pages 專案設定以官方 `cf` CLI 管理；此專案沒有 Wrangler 設定檔，也沒有改為 Workers 部署。

CSP 允許既有 Cloudflare Web Analytics 從 `https://static.cloudflareinsights.com` 載入分析腳本；自動注入的 beacon 使用本站 `/cdn-cgi/rum`，由 `connect-src 'self'` 允許。參考 [Cloudflare Web Analytics CSP 說明](https://developers.cloudflare.com/web-analytics/faq/#what-do-i-need-to-add-to-my-content-security-policy-csp)。

Pages 的 Node 版本亦可由 `NODE_VERSION` 覆寫。調整 Node 時，請同步更新 `.node-version` 與 Pages production、preview 的環境設定，並確認 npm 的 engine 要求。參考 [Pages build image 文件](https://developers.cloudflare.com/pages/configuration/build-image/)。

目前 demo session 存在單一執行個體的記憶體中。Cloudflare 不保證後續請求使用同一執行個體，因此登入狀態可能失效。若要穩定的多執行個體登入，需將 session 改為共用的持久儲存；目前的示範登入不具備此保證。

### Node 伺服器

使用 `npm run build` 後執行 `node .output/server/index.mjs`。登入、BFF 與示範結帳需要伺服器，因此不提供純靜態產生指令；HTTPS 是正式環境 session cookie 的必要條件。

```bash
npm ci
npm run test:security
npm run test:server
npm run audit:security
npm run typecheck
npm run build
```

`test:security` 檢查已修補套件與異常輸入，`audit:security` 驗證修補內容並拒絕其他漏洞。`test:server` 檢查 Pages adapter 的 JSON 讀取與 Node chunked request 的大小限制。測試使用 Node.js 內建 runner；目前未配置 CI 或 lint。

### 套件範圍

保留 Nuxt／Vue、Pinia、i18n 與 Tailwind，支援現有頁面、購物車、登入與雙語介面。Tailwind 工具放在 `devDependencies`。圖片使用原生 `<img>`，表單使用現有元件樣式與原生控制項；不另外維護圖片處理、Sitemap 或瀏覽器測試套件。`$fetch` 使用 Nuxt 內建功能，`useI18n` 使用 i18n 模組的自動匯入；`ofetch`、`vue-i18n` 與 `esbuild` 由對應框架管理，專案不再直接宣告。

套件更新時用 `npm outdated` 與 `npm audit` 查核；esbuild 的安裝腳本採精確版本 allowlist。升級 esbuild 時先檢查新腳本，再執行 `npm install-scripts approve esbuild` 與 `npm install-scripts prune`，不要全域停用警告或開放所有腳本。

目前 TypeScript 固定在 `~6.0.3`：7.0.2 與 vue-tsc 3.3.13 實測不相容，型別檢查會因 `typescript/lib/tsc` 未匯出而失敗。H3 保留 Nitro 2 使用的 1.x；`@types/node` 使用與 `.node-version` 相符的 24.x。

更新 i18n 模組時，也要更新 lockfile 中相容的 `vue-i18n` 與 `@intlify/*` 相依，避免新舊版本混用。

`braces` 與 `node-forge` 仍透過 `patch-package` 在安裝時套用版本限定的修補，並以 `test:security`、`audit:security` 驗證所有 lockfile 副本。雜湊驗證會統一 LF／CRLF 換行，其餘內容異動仍會失敗。目前原始 `npm audit` 剩下 `node-forge` 的 `GHSA-86w9-cpqp-85rv` 與其相依鏈；1.4.0 尚無上游修復版，專案已保留 RSA 驗證補丁與回歸測試。`audit:security` 會檢查補丁內容，並拒絕未修補或新增的 advisory；它不代表原始 `npm audit` 為零漏洞。

## 貢獻原則

- 不要從瀏覽器直接呼叫 Fake Store API；請透過 BFF 增加或調整端點。
- 不要把密碼、token 或含有敏感欄位的上游 DTO 放進前端 state、log 或畫面。
- 為新功能建立自己的 feature 邊界，避免跨 feature 直接讀寫內部 state。
- 新增可見文字時，同步補上繁中與英文翻譯，並保留鍵盤與螢幕閱讀器可用性。

## 授權與資料來源

本專案使用 Fake Store API 作為示範資料來源；其資料與行為以該服務的規範為準。請參考 [Fake Store API](https://fakestoreapi.com/) 了解其使用方式與限制。
