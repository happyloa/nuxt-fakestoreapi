# Storefront Lab

以 [Fake Store API](https://fakestoreapi.com/) 為資料來源的 Nuxt 4 示範商店：商品瀏覽、購物車、示範登入與結帳、API 操作台，支援繁中／英文與深色模式。資料皆為公開假資料，不會付款或出貨。

線上版：<https://nuxt-fakestoreapi.worksbyaaron.com>

## 開發

需要 Node.js `24.21.0`（`.node-version`）與 npm `12.2.1` 以上（lockfile v4 與原生補丁需要，版本不符會被 `engine-strict` 擋下）。

```bash
npm install -g npm@12.2.2
npm ci
npm run dev
```

Windows 若升級後 `npm --version` 沒變，改用：`npm.cmd install --global npm@12.2.2 --prefix (Split-Path (Get-Command node.exe).Source)`

## 指令

| 指令 | 用途 |
| --- | --- |
| `npm test` | 離線測試 |
| `npm run verify` | typecheck + 測試 + 安全稽核 |
| `npm run build` / `npm start` | Node 建置與啟動（`start` 會設定 `NODE_ENV=production`） |
| `npm run build:cloudflare` | 先跑測試，再輸出 Cloudflare Pages 的 `dist` |

## 環境變數

本機可複製 `.env.example` 為 `.env`；Node 正式產物不讀 `.env`，需由執行環境提供。

| 變數 | 用途 |
| --- | --- |
| `NUXT_PUBLIC_I18N_BASE_URL` | 公開網址（canonical、hreflang、分享圖） |
| `NUXT_FAKE_STORE_API_BASE` | 上游 API，預設 `https://fakestoreapi.com` |
| `NUXT_SESSION_PASSWORD` | Session 加密金鑰，至少 32 字元，所有執行個體相同 |

## 部署

Cloudflare Pages 從 `main` 自動部署：build command `npm run build:cloudflare`、output `dist`。production／preview 都要開啟 `nodejs_compat` 並設定 `NUXT_SESSION_PASSWORD`；未設定時登入只在單一執行個體有效。

## 限制

- 結帳只在本站回傳收據，不會建立真實訂單。
- Session 是加密 cookie，有效 7 天；登出只清除瀏覽器上的 cookie。
- 購物車存在瀏覽器，最多 50 項、每項 99 件。
- 登入、API 與結帳需要伺服器，沒有純靜態版本。

## 維護

- 刻意保留的主版本：`h3` 1（Nitro 2 需要）、`typescript` 6（`vue-tsc` 需要 `typescript/lib/tsc`）、`@types/node` 24（對應執行環境）。
- `overrides` 中的 `glob`、`minimatch`、`node-forge`：上層套件的版本範圍含已知漏洞，需保留。
- `deepmerge` 以 `patches/` 的 npm 原生補丁修補 `GHSA-gcqx-w48m-w2h4`（上游未修），所以 `npm audit` 仍會列出 7 個 low；以 `npm run audit:security` 判讀。
- esbuild 安裝腳本採版本白名單，升級後執行 `npm install-scripts approve esbuild` 與 `npm install-scripts prune`。
- 設計變數（顏色、字距、`meta` 小字）集中在 `app/assets/css/tailwind.css`。
