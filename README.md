# Storefront Lab

以 [Fake Store API](https://fakestoreapi.com/) 為資料來源的 Nuxt 4 示範店面，使用 Pinia、Nuxt i18n 與 Tailwind CSS。資料皆為公開假資料，不處理真實付款、出貨或訂單；請勿輸入敏感資料。

## 功能

- 商品瀏覽、分類、搜尋、排序與詳情
- 本機購物車、示範登入、結帳與收據
- 繁體中文／英文、深色模式與響應式介面
- 商品、使用者與購物車 API 操作台；上游新增、修改、刪除不保證永久保存

## 本機開發

本機與 Pages 使用 Node.js `24.21.0`、npm `12.2.1`，分別記錄在 `.node-version` 與 `package.json`。`.npmrc` 會拒絕不符合 `engines` 的版本。

若 npm 版本較舊，先執行 `npm install -g npm@12.2.1`，再安裝並啟動：

```bash
npm ci
npm run dev
```

需要覆寫設定時，複製 `.env.example` 為 `.env`：

| 變數 | 用途 |
| --- | --- |
| `NUXT_PUBLIC_SITE_URL` | canonical 與社群分享的公開網址 |
| `NUXT_PUBLIC_I18N_BASE_URL` | 語系連結的公開網址，應與上一項一致 |
| `NUXT_FAKE_STORE_API_BASE` | 伺服器端上游 API，預設 `https://fakestoreapi.com` |

## 驗證

```bash
npm run typecheck
npm run test:security
npm run test:server
npm run test:cart
npm run audit:security
```

測試使用 Node.js 內建 runner，涵蓋安全補丁、請求大小限制，以及結帳成功、失敗與登出後過期回應的競態。

## 建置與部署

| 目標 | 建置指令 | 產物 |
| --- | --- | --- |
| Node | `npm run build` | `.output/server/index.mjs` |
| Cloudflare Pages | `npm run build:cloudflare` | `dist` |

Node 建置完成後，可用 `npm run preview` 預覽，或以 `node .output/server/index.mjs` 啟動。

既有 Pages 專案由 GitHub `main` 分支自動部署，build command 為 `npm run build:cloudflare`、output directory 為 `dist`，production／preview 均需 `nodejs_compat`。已核對成功部署紀錄中的 Node.js 與 npm 版本；升級工具鏈後請再核對，Pages 不會從 `engines` 安裝指定版本。參考 [Pages build image 文件](https://developers.cloudflare.com/pages/configuration/build-image/)。

## 資料與登入限制

- 瀏覽器透過本站 `/api/*` 呼叫上游；登入回應不包含上游 token 或密碼。正式環境的 session cookie 使用 `HttpOnly`、`Secure`、`SameSite=Lax`，需要 HTTPS。
- Session 存在伺服器程序記憶體中，重啟即失效。Pages 不保證請求落在同一執行個體，登入可能失效；目前沒有跨執行個體的 session 儲存。
- 購物車存在瀏覽器本機，每車最多 50 項、每項最多 99 件。登入保留訪客商品，結帳失敗保留商品，登出會清空商品與收據並忽略舊結帳回應。
- 示範結帳只在本站回傳收據，不會向上游建立真實訂單。登入、API 與結帳需要伺服器，不提供純靜態建置。

## 套件維護

TypeScript 6、H3 1 與 Node 24 型別是目前通過驗證的相容組合。更新 i18n 時，請一併更新 lockfile 中相容的 `vue-i18n` 與 `@intlify/*` 相依。

Nuxt 已更新至 `4.6.3`、`vue-tsc` 至 `3.3.14`。透過 overrides 將間接相依的 `glob`、`minimatch` 與 `node-forge` 更新至安全版本；`node-forge` 使用官方 `1.4.2` 修正，已移除舊補丁。

`braces` 與 `deepmerge` 使用 npm 原生 `patchedDependencies`；lockfile v4 記錄補丁雜湊，`patches/*.patch` 固定使用 LF。即使執行 `npm ci --ignore-scripts`，補丁仍會套用；補丁遺失、變更或無法套用會中止安裝。維護方式見 [npm patch 文件](https://docs.npmjs.com/cli/v12/commands/npm-patch/)。`deepmerge` 補丁阻擋兩個合併來源的 `__proto__` 鍵，並涵蓋原始碼、CommonJS 與 UMD 入口；回歸測試檢查原型污染與一般合併行為。

原始 `npm audit` 目前仍列出 7 個低風險項目，皆來自 `deepmerge` 的 `GHSA-gcqx-w48m-w2h4` 與其相依鏈。上游尚無官方修正版；`audit:security` 會驗證補丁內容並拒絕其他 advisory，通過不代表原始 audit 為零漏洞。

更新套件時先執行 `npm outdated`、`npm audit`。esbuild 安裝腳本採精確版本白名單；升級後先檢查腳本，再執行 `npm install-scripts approve esbuild`、`npm install-scripts prune`。
