# Storefront Lab

以 [Fake Store API](https://fakestoreapi.com/) 為資料來源的 Nuxt 4 示範店面，使用 Pinia、Nuxt i18n 與 Tailwind CSS。資料皆為公開假資料，不處理真實付款、出貨或訂單；請勿輸入敏感資料。

## 功能

- 商品瀏覽、分類、搜尋、排序與詳情
- 本機購物車、示範登入、結帳與收據
- 繁體中文／英文、深色模式與響應式介面
- 商品、使用者與購物車 API 操作台；上游新增、修改、刪除不保證永久保存

## 本機開發

建議使用 Node.js `24.21.0`、npm `12.2.2`，分別記錄在 `.node-version` 與 `package.json`。`.npmrc` 會拒絕不符合 `engines` 的版本；目前最低需要 npm `12.2.1`，才能套用原生安全補丁與讀取 lockfile v4。`packageManager` 只記錄版本，不會自動升級本機 npm。

若 npm 版本較舊，先執行 `npm install -g npm@12.2.2`，確認 `npm --version` 至少為 `12.2.1`，再安裝並啟動：

```bash
npm ci
npm run dev
```

Windows PowerShell 若因執行原則攔截 `npm.ps1`，請使用 `npm.cmd`。若全域升級成功後版本仍未改變，通常是 PATH 優先指向 Node 隨附的舊 npm；可更新目前 Node 所在目錄的 npm，再確認版本：

```powershell
npm.cmd install --global npm@12.2.2 --prefix (Split-Path (Get-Command node.exe).Source)
npm.cmd --version
npm.cmd ci
npm.cmd run dev
```

若顯示 `EBADENGINE`，請依錯誤中的 `Required` 與 `Actual` 更新 Node／npm；不要關閉 `engine-strict`，以免舊 npm 忽略安全補丁。

需要覆寫設定時，複製 `.env.example` 為 `.env`：

| 變數 | 用途 |
| --- | --- |
| `NUXT_PUBLIC_SITE_URL` | canonical 與社群分享的公開網址 |
| `NUXT_PUBLIC_I18N_BASE_URL` | 語系連結的公開網址，應與上一項一致 |
| `NUXT_FAKE_STORE_API_BASE` | 伺服器端上游 API，預設 `https://fakestoreapi.com` |

`nuxt.config.ts` 只設定 runtime config 預設值，由 Nuxt 在執行時套用上述環境變數。i18n 的 `baseUrl` 放在 `runtimeConfig.public.i18n`，讓同一份建置產物可切換部署網址；`NUXT_PUBLIC_SITE_URL` 與 `NUXT_PUBLIC_I18N_BASE_URL` 請設為相同值。伺服器 API 使用 `useRuntimeConfig(event)` 讀取該次請求的設定。

直接執行 Node 正式產物時不會載入 `.env`，需由啟動環境提供變數；Pages 則在對應的 production／preview 環境設定。參考 [Nuxt runtime config](https://nuxt.com/docs/4.x/guide/going-further/runtime-config) 與 [Nuxt i18n runtime config](https://i18n.nuxtjs.org/docs/api/runtime-config)。

## 驗證

```bash
npm test          # 執行 tests/*.test.mjs，離線即可
npm run verify    # typecheck + 測試 + audit:security（audit 需要網路）
```

測試使用 Node.js 內建 runner，涵蓋安全補丁、請求大小限制、API 操作台路徑解析與敏感欄位移除、zh／en 語系 key 一致性，以及購物車上限與結帳成功、失敗、登出後過期回應的競態。

## 建置與部署

| 目標 | 建置指令 | 產物 |
| --- | --- | --- |
| Node | `npm run build` | `.output/server/index.mjs` |
| Cloudflare Pages | `npm run build:cloudflare` | `dist` |

Node 建置完成後，可用 `npm run preview` 預覽，正式啟動請用 `npm start`。它會在未設定時把 `NODE_ENV` 設為 `production` 再載入 `.output/server/index.mjs`；直接執行 `node .output/server/index.mjs` 時，外部化的 `vue-router`、`@intlify/*` 會保留開發診斷，例如每個不存在的網址都會輸出路由警告。

安全標頭只在 `nuxt.config.ts` 的 `routeRules` 設定一次：Node 直接套用，Cloudflare Pages 建置時 Nitro 會同時寫入 `dist/_headers` 供靜態檔使用，`public/` 不需要另外放 `_headers`。`/api/catalog` 與 `/api/products/:id` 在 handler 內以資源為快取 key（忽略查詢字串）快取 5 分鐘；Nitro 快取使用最多 500 筆的 LRU，避免記憶體無限成長。

既有 Pages 專案由 GitHub `main` 分支自動部署，build command 為 `npm run build:cloudflare`、output directory 為 `dist`，production／preview 均需 `nodejs_compat`。已核對成功部署紀錄中的 Node.js 與 npm 版本；升級工具鏈後請再核對，Pages 不會從 `engines` 安裝指定版本。參考 [Pages build image 文件](https://developers.cloudflare.com/pages/configuration/build-image/)。

## 資料與登入限制

- 瀏覽器透過本站 `/api/*` 呼叫上游；登入回應不包含上游 token 或密碼。正式環境的 session cookie 使用 `HttpOnly`、`Secure`、`SameSite=Lax`，需要 HTTPS。
- Session 存在伺服器程序記憶體中，重啟即失效。Pages 不保證請求落在同一執行個體，登入可能失效；目前沒有跨執行個體的 session 儲存。
- 購物車存在瀏覽器本機，每車最多 50 項、每項最多 99 件。登入保留訪客商品，結帳失敗保留商品，登出會清空商品與收據並忽略舊結帳回應。
- 示範結帳只在本站回傳收據，不會向上游建立真實訂單。登入、API 與結帳需要伺服器，不提供純靜態建置。

## 套件維護

TypeScript 6、H3 1 與 Node 24 型別是目前通過驗證的相容組合。更新 i18n 時，請一併更新 lockfile 中相容的 `vue-i18n` 與 `@intlify/*` 相依。

Nuxt 已更新至 `4.6.4`、Vue 至 `3.5.45`、Vue Router 至 `5.5.0`、Tailwind CSS 與其 Vite plugin 至 `4.3.5`，`vue-tsc` 維持最新版 `3.3.14`。透過 overrides 將間接相依的 `glob`、`minimatch` 與 `node-forge` 更新至 `14.0.4`、`11.0.7` 與 `1.4.3`；`node-forge` 使用官方修正，無需本機補丁。

直接宣告開發相依 `esbuild@^0.28.2`，滿足 Vite 8 的 optional peer 要求。i18n 的 `@intlify/bundle-utils` 仍使用其相容的 `esbuild@0.25.12`；兩者分別安裝，避免舊版被提升至根目錄後導致 `ERESOLVE`。

以下套件保留相容主版本，因此 `npm outdated` 仍會列出它們；升級時需連同工具鏈遷移：

| 套件 | 使用版本 | 最新主版本 | 保留原因 |
| --- | --- | --- | --- |
| `h3` | `1.15.11` | `2.0.8` | Nuxt `4.6.4` 的 Nitro 2 整合仍依賴 H3 1；H3 2 的事件與請求 API 不相容。 |
| `typescript` | `6.0.3` | `7.0.2` | `vue-tsc` 與購物車測試仍使用 JavaScript compiler API；TypeScript 7 未提供相同入口。 |
| `@types/node` | `24.19.2` | `26.6.6` | 型別需與專案的 Node 24 執行環境一致。 |

Nuxt 已處理 Vue 打包與 Windows renderer 路徑，無需額外的 `@vue/shared`、Nuxt dist inline 設定；保留 Pinia inline，確保 SSR 的 Nuxt plugin 與 stores 使用同一個實例。Tailwind 維持官方 Vite plugin 配置，i18n 模組的相依最佳化交由模組與 Nuxt 管理。

`deepmerge` 使用 npm 原生 `patchedDependencies`；lockfile v4 記錄補丁雜湊，`patches/*.patch` 固定使用 LF。即使執行 `npm ci --ignore-scripts`，補丁仍會套用；補丁遺失、變更或無法套用會中止安裝。維護方式見 [npm patch 文件](https://docs.npmjs.com/cli/v12/commands/npm-patch/)。`deepmerge` 補丁阻擋兩個合併來源的 `__proto__` 鍵，並涵蓋原始碼、CommonJS 與 UMD 入口；回歸測試檢查原型污染與一般合併行為。`braces` 的 `GHSA-vfj7-8cjw-p6xm` 已於 2026-10-23 由 GitHub 撤銷，因此不再保留其補丁。

原始 `npm audit` 目前仍列出 7 個低風險項目，皆來自 `deepmerge` 的 `GHSA-gcqx-w48m-w2h4` 與其相依鏈。上游尚無官方修正版；`audit:security` 會驗證補丁內容並拒絕其他 advisory，通過不代表原始 audit 為零漏洞。

更新套件時先執行 `npm outdated`、`npm audit`。esbuild 安裝腳本採精確版本白名單；升級後先檢查腳本，再執行 `npm install-scripts approve esbuild`、`npm install-scripts prune`。
