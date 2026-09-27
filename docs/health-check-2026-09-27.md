# 專案健檢（2026-09-27）

## 驗證範圍與結果

- Node.js 24.12.0、npm 11.6.2；專案宣告支援 Node.js 22.19+、24.11+、26+。
- `npm outdated`：除 h3 2.0.1-rc.32 與 TypeScript 7.0.2 外，直接相依套件均為 npm 最新版。h3 2 仍為候選版，且需從 v1 遷移；Nuxt 4.5.2 的 Nitro 2 仍使用 h3 1。TypeScript 7.0.2 實測使 vue-tsc 3.3.11 的 `nuxt typecheck` 發生 `ERR_PACKAGE_PATH_NOT_EXPORTED`，故採用可通過檢查的最新 6.x 版 6.0.3。
- `npm audit`：0 個已知漏洞。
- `npm run typecheck`：通過。
- `npm run build`：通過。受限檔案系統中 Nitro 曾在讀取 `C:\Users\User` 的連結資訊時遇到 `EPERM`；以正常檔案權限重跑後通過。
- 本機啟動正式建置後，`GET /api/auth/me` 回傳 200 與未登入狀態，`GET /robots.txt` 回傳 200 與預期 sitemap URL；兩者均帶有設定的安全標頭。
- 尚未執行瀏覽器畫面與實際登入流程測試；專案沒有自動化測試或 CI 設定。

## 直接相依套件配置核對

| 套件 | 現況與核對結果 |
| --- | --- |
| `nuxt` | 4.5.2；採用 Nuxt 4 的 `app/`、`server/`、`shared/` 目錄與分離的 tsconfig references，符合 [Nuxt 4 升級指南](https://nuxt.com/docs/4.x/getting-started/upgrade)。 |
| `@nuxt/image` | 2.1.0；已在 `image.domains` 限制遠端最佳化網域，商品圖片使用 `<NuxtImg>` 並設定尺寸與 lazy loading，符合 [Nuxt Image 配置](https://image.nuxt.com/get-started/configuration)。 |
| `@nuxtjs/google-fonts` | 3.2.0；在 Nuxt 模組中配置字重與 `display: swap`。目前 `download: false` 會保留對 Google Fonts 的外部請求；是可用配置，日後可評估自託管。 |
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

## 待改善項目

1. **部署可靠性：** `server/utils/session.ts` 把登入 session 放在行程記憶體。重新啟動或多實例部署會讓 session 消失或在不同實例間無法共用。若此 demo 要提供穩定登入，應改用共享且有到期時間的 session 儲存，並加入大小或數量限制。
2. **驗證缺口：** 專案沒有測試腳本與 CI。建議至少加入 BFF 輸入驗證、登入／登出、購物車、SSR 與 sitemap 的測試，並在 CI 跑 `npm ci`、typecheck、build、audit；同時覆蓋宣告支援的 Node 版本。
3. **安全標頭：** `nuxt.config.ts` 與 `public/_headers` 的 CSP 均允許 `unsafe-inline`。應先盤點 Nuxt hydration 與必要的 inline 資源，再研究 nonce 或 hash；目前不能直接移除，以免破壞頁面。
4. **效能：** Google Fonts 使用遠端樣式與字型。可比較自託管方案的實際 LCP 與快取效果；目前只有本機 build 體積資料，尚無真實頁面指標。
5. **sitemap 可用性：** 動態商品 URL 依賴 Fake Store API。冷啟動且上游失效時，sitemap 資料源可能失敗；若搜尋收錄重要，可考慮最近成功結果的持久化快取。

以上是程式碼、設定與本機建置檢查；效能、無障礙與正式站登入行為仍需瀏覽器及部署環境驗證。
