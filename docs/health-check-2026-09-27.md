# 專案健檢（2026-09-27）

## 驗證範圍與結果

- Node.js 24.12.0、npm 11.6.2；專案宣告支援 Node.js 22.19+、24.11+、26+。
- `npm outdated`：除 h3 2.0.1-rc.32 與 TypeScript 7.0.2 外，直接相依套件均為 npm 最新版。h3 2 仍為候選版，且需從 v1 遷移；Nuxt 4.5.2 的 Nitro 2 仍使用 h3 1。TypeScript 7.0.2 實測使 vue-tsc 3.3.11 的 `nuxt typecheck` 發生 `ERR_PACKAGE_PATH_NOT_EXPORTED`，故採用可通過檢查的最新 6.x 版 6.0.3。
- `npm audit`：0 個已知漏洞。
- `npm run typecheck`：通過。
- `npm run build`：通過。受限檔案系統中 Nitro 曾在讀取 `C:\Users\User` 的連結資訊時遇到 `EPERM`；以正常檔案權限重跑後通過。
- 本機啟動正式建置後，`GET /api/auth/me` 回傳 200 與未登入狀態，`GET /robots.txt` 回傳 200 與預期 sitemap URL；兩者均帶有設定的安全標頭。
- 已以 Chrome/Lighthouse 量測首頁載入效能；尚未執行互動流程、真實登入或實際使用者 INP 量測。依試做專案需求，不加入自動化測試、CI 或 ESLint。

### 後續弱點掃描與修復

- 再次執行 `npm audit`（完整依賴樹及 `--omit=dev`）：均為 0 個已知漏洞。移除字型模組後，以官方 OSV-Scanner 2.6.0 掃描 `package-lock.json` 的 883 個套件：未發現已知漏洞。
- 程式碼檢查發現原本的 32 KiB 請求限制只依賴 `Content-Length`；chunked 請求可讓 h3 在驗證前讀取超量本文。登入、示範訂單與 playground 的 JSON 本文現改為讀取時限制 32 KiB。正式建置以 40 KiB chunked 請求確認回傳 413；無效 JSON、跨來源、錯誤 Content-Type 與未登入訂單分別回傳 400、403、415、401。
- 記憶體內的 demo session 新增 10,000 筆上限，達上限時移除最早建立的 session；仍只供單程序示範使用。
- Node 伺服器回應補上原本僅在 `public/_headers` 中的 HSTS 與 Cross-Origin-Opener-Policy 標頭。
- Gitleaks 8.30.1 掃描 236 筆 Git commit 與工作目錄，未發現憑證外洩。

### 首頁效能量測與調整

Lighthouse 13.5.0 以 Chrome 行動裝置模擬條件量測；分數與時間會受網路、Fake Store API 及快取狀態影響，不能視為真實使用者資料或正式環境改善幅度。

| 量測對象 | 效能分數 | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| 目前公開站（調整前的部署） | 58 | 8.0 秒 | 8.0 秒 | 0 毫秒 | 0.0003 |
| 本機正式建置，調整前 | 62 | 6.1 秒 | 6.6 秒 | 0 毫秒 | 0.0006 |
| 本機正式建置，調整後兩次 | 69–70 | 4.8 秒 | 5.0–5.1 秒 | 17 毫秒 | 0 |

- 公開站商品圖片仍指向 Fake Store API 原圖，單張下載約 145–343 KB；本機建置已輸出 Nuxt Image 的 `/_ipx/` 最佳化網址，抽查一張 WebP 約 7.8 KB。正式站需部署目前版本後才能取得這項改善；本次未部署。
- 本機調整前載入一份約 134 KB 的 Google Fonts CSS 及多份中文字型檔，Lighthouse 將該 CSS 判為約 130 KB 未使用。已移除字型模組，使用系統中文字型；調整後的請求清單沒有 Google Fonts 連線。字型外觀可能因作業系統而略有差異。
- 首屏 LCP 元素是小型 SVG 插畫；改為直接載入靜態 SVG，設定尺寸、`loading="eager"` 與 `fetchpriority="high"`。商品圖仍以 `<NuxtImg>` 最佳化並延遲載入。
- 首頁 SSR 等待上游商品目錄；本機量測的文件回應時間在 27–1,302 毫秒之間波動，公開站約 876 毫秒。既有 `/api/catalog` 具 300 秒 SWR 快取；冷啟動與上游延遲仍會影響首屏。TBT 很低，這次沒有證據顯示主執行緒 JavaScript 是主要卡頓來源。
- Lighthouse CLI 在 Windows 清理 Chrome 暫存 profile 時回報 `EPERM`，但三份本機報告與一份公開站報告均已產生並可解析；數值取自報告 JSON。

## 直接相依套件配置核對

| 套件 | 現況與核對結果 |
| --- | --- |
| `nuxt` | 4.5.2；採用 Nuxt 4 的 `app/`、`server/`、`shared/` 目錄與分離的 tsconfig references，符合 [Nuxt 4 升級指南](https://nuxt.com/docs/4.x/getting-started/upgrade)。 |
| `@nuxt/image` | 2.1.0；已在 `image.domains` 限制遠端最佳化網域，商品圖片使用 `<NuxtImg>` 並設定尺寸與 lazy loading，符合 [Nuxt Image 配置](https://image.nuxt.com/get-started/configuration)。 |
| `@nuxtjs/i18n`、`vue-i18n` | 10.6.0、11.4.12；模組配置兩種 locale、翻譯檔、站點 URL 與僅根目錄的瀏覽器語言導向，符合 [i18n 配置](https://i18n.nuxtjs.org/docs/api/options)。 |
| `@pinia/nuxt`、`pinia` | 1.0.2、4.0.3；模組已啟用、stores 放在 `app/stores`，符合 [Pinia Nuxt 指南](https://pinia.vuejs.org/ssr/nuxt)。 |
| `@tailwindcss/vite`、`tailwindcss`、`@tailwindcss/forms` | 4.3.3、4.3.3、0.5.11；使用 Vite 插件、CSS `@import "tailwindcss"` 與 `@plugin`，符合 [Tailwind Vite 安裝](https://tailwindcss.com/docs/installation/using-vite)及[指令說明](https://tailwindcss.com/docs/functions-and-directives)。 |
| `aos` | 2.3.4；只在客戶端掛載完成後啟動，尊重減少動態偏好。已移除換頁時的 `refreshHard()`，因套件預設的 MutationObserver 會自動處理 DOM 更新，見 [AOS API](https://github.com/michalsnik/aos)。 |
| `h3` | 1.15.11；與目前 Nitro 2 的 h3 1 保持同代。npm `latest` 標籤雖指向 2.0.1-rc.32，但 [h3 v2 遷移指南](https://h3.dev/migration)列出多項 API 與行為變更，暫不引入候選版。 |
| `ofetch` | 1.5.1；上游請求已配置逾時與有限 GET 重試，POST 不重試，符合此專案的 BFF 使用方式。 |
| `vue`、`vue-router` | 3.5.43、5.3.1；由 Nuxt 整合路由與 SSR，無額外 Router 配置。 |
| `@nuxtjs/sitemap` | 8.5.1；配置動態 URL 資料源與非公開頁面排除，符合 [Nuxt Sitemap 動態 URL](https://nuxtseo.com/docs/sitemap/guides/dynamic-urls)。 |
| `@types/node` | 26.6.3；是最新版，但專案也宣告支援 Node 22/24，應在這兩個版本上跑 CI，以避免誤用僅 Node 26 才有的 API。 |
| `esbuild` | 0.28.2；腳本允許清單也涵蓋 i18n 間接相依使用的 0.25.12，與安裝樹一致。 |
| `typescript`、`vue-tsc` | 6.0.3、3.3.11；TypeScript 固定在通過 Nuxt 型別檢查的 6.x，避免 7.0.2 的已重現錯誤。 |

## 剩餘限制與可選改善

1. **部署可靠性：** session 雖有容量上限，仍存在單一行程記憶體。重新啟動或多實例部署會讓 session 消失或在不同實例間無法共用。若未來需要穩定登入，再改用共享且有到期時間的 session 儲存。
2. **驗證方式：** 依此試做專案的維護需求，不加入自動化測試、CI 或 ESLint；修改後以手動 typecheck、正式建置及弱點掃描驗證。宣告支援的 Node 22/26 尚未在本機驗證。
3. **安全標頭：** `nuxt.config.ts` 與 `public/_headers` 的 CSP 均允許 `unsafe-inline`。應先盤點 Nuxt hydration 與必要的 inline 資源，再研究 nonce 或 hash；目前不能直接移除，以免破壞頁面。
4. **效能：** 本機實驗室數據已有改善，但公開站尚未部署目前變更；部署後應重新量測，並取得真實使用者的 LCP、INP、CLS。若冷啟動仍慢，可考慮讓公開商品目錄使用更持久的快取；需先確認資料更新需求。
5. **sitemap 可用性：** 動態商品 URL 依賴 Fake Store API。冷啟動且上游失效時，sitemap 資料源可能失敗；若搜尋收錄重要，可考慮最近成功結果的持久化快取。

以上涵蓋程式碼、設定、本機正式建置與首頁效能實驗室量測；無障礙互動、實際使用者效能及正式站登入行為仍需部署環境驗證。
