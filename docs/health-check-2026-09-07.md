# 專案健檢與套件配置檢查（2026-09-07）

## 結論

已處理套件漏洞、安裝及建置警告，並修復登入與購物車實作和文件不一致的問題。專案適合作為具備 BFF 的示範店面；不能把「npm audit 0」或測試通過解讀為正式電商的完整安全認證。

## 套件與工具鏈

| 項目 | 結果與配置理由 |
| --- | --- |
| Nuxt | 4.5.2；使用預設 `app/`、根目錄 `server/`、`shared/`，移除多餘 srcDir 與失效的 app/server tsconfig。 |
| TypeScript | 根設定使用 app/server/shared/node 四個 project references，分開檢查執行環境。6.0.3 為相容例外；7.0.2 搭配最新版 vue-tsc 3.3.11 會發生 `ERR_PACKAGE_PATH_NOT_EXPORTED: typescript/lib/tsc`，不可直接升級。 |
| Vue / Router / Pinia | 3.5.42 / 5.3.1 / 4.0.3，@pinia/nuxt 1.0.2。直接引用的 Vue、Router、ofetch、H3 均明列依賴。 |
| H3 | 1.15.11；npm latest tag 指向 2.0.1-rc.31，屬預發佈版本，且與 Nitro 2 的事件 API 不同，保留穩定相容版本。 |
| Tailwind | 4.3.3，使用官方 Vite plugin 與 CSS-first `@theme`、`@plugin`；無舊版 PostCSS / tailwind.config 重複整合。 |
| i18n | @nuxtjs/i18n 10.6.0、vue-i18n 11.4.10；Composition API、標準根目錄 i18n/locales 與 i18n.config.ts。內部 @intlify 系列同步更新，避免新 runtime 配到舊 shared 而無法建置。 |
| i18n 棄用依賴 | 精確限制在 unplugin 子樹，改用 vue-i18n-extensions 9.0.0，移除其 8.x 引入的 vue-i18n 10。新版 extensions 宣告支援 Vue I18n 11。 |
| glob 棄用依賴 | 只覆寫 archiver-utils 使用的 glob 為 13.0.6。其使用的 `glob.sync` API 仍存在；完整 Nitro production build 驗證可用，沒有全域強制覆寫所有依賴。 |
| 圖片 | @nuxt/image 2.1.0，維持 fakestoreapi.com 網域 allowlist、尺寸、WebP 與列表 lazy loading；限制圖片代理的可抓取範圍。 |
| 字型 | @nuxtjs/google-fonts 3.2.0，保留 Noto Sans TC，刪減字重、使用 swap。download:false 避免建置依賴 Google 下載；仍有外部字型連線，離線會用系統字型。 |
| 動畫 | AOS 2.3.4 僅 client 初始化一次、尊重 reduced-motion；移除延遲重掃計時器，未初始化前 SSR 內容仍可見。 |
| Sitemap | 8.5.0，使用 runtime 動態商品來源，涵蓋中英文商品網址並排除帳戶、購物車、登入及操作台。API 商品會變動，因此不再使用沒有商品來源的 zeroRuntime sitemap。 |
| 安裝政策 | esbuild 0.25.12 / 0.28.2 精確版本 allowScripts，不用 ignore-scripts 或降低 log level 隱藏警告。npm 固定已驗證的 11.19.1；目前機器 Node 24.12.0 不符合 npm 12.0.2 的 Node >=24.15.0 條件。 |
| 鎖定檔 | 已更新直接與相容間接依賴，用 npm ci 驗證可重現安裝。nanoid 升至 3.3.18，npm audit 已知漏洞總數為 0。 |
| Nitro 建置 | 針對 @vue/shared 內嵌小型 helper，避開 Node DEP0155 的尾斜線套件解析；未壓掉全域 deprecation warnings。 |

## 本次已修復

- 登入原先將 JWT 放在前端可讀 cookie，現在串接已存在的 server session BFF，以 HttpOnly / Secure / SameSite=Lax cookie 保存不透明 ID。`/api/auth/me` 回傳一致的 session DTO，瀏覽器不取得上游 token 或密碼。
- 路由守衛等待 session 初始化，登出確實撤销伺服器 session；登入回跳限制站內路徑，拒絕反斜線與控制字元。
- 購物車保存在本機並驗證還原資料。登入不再覆蓋訪客商品，取消原本每次加減都對上游 POST 的虛假同步。結帳有數量上限、防重複請求與失敗保留。
- API 操作台保留原功能，但改走固定路徑的 BFF，設定逾時、驗證方法與查詢、移除回應秘密欄位；瀏覽器不再直接打 Fake Store API。修改型請求檢查來源與 JSON 類型。
- 首頁以單一 catalog BFF 取得商品與分類；商品详情使用具路由 key 的 useAsyncData，避免導覽重用錯誤商品；null 商品回傳 404，不把單件商品快取誤認為完整列表。
- JSON-LD 跳脫 `<`，避免上游文字終止 script 元素。共用 DTO 移至 shared/types，移除 User 回傳型別中的 password。
- layout 改用 slot，不再重複掛載 NuxtPage。canonical 交由 i18n 集中產生、分享圖使用絕對 URL，移除頁面標題的重複品牌後綴。
- 手機篩選先於商品結果、桌面保留側欄；價格排序、錯誤重試、繼續購物及持續顯示的示範結帳完成提示。中英文文案明確說明本機購物車與非真實交易。
- 手機導覽採原生 dialog，具有 modal 焦點管理、Esc 關閉與背景捲動鎖定；手機可直接進購物車。改善窄螢幕通知寬度、商品數量上限與停用連結行為。
- 加入 Node 內建測試及 CI；GitHub Actions 使用已核對的最新版 checkout 7.0.1 / setup-node 7.0.0，鎖定 commit SHA，僅授予 contents:read，不保存 checkout 憑證。

## 驗證範圍

- npm ci：驗證乾淨安裝，確認 deprecated、site URL、安裝腳本警告已消除。
- npm audit：0 已知漏洞；npm outdated 僅剩 TypeScript 7 與 H3 2 RC 兩項有原因的相容例外。
- npm run typecheck、production build。
- 購物車單元測試：不可信 localStorage、資料上限、精確金額、數量上限、刪除、失敗保留與重複結帳。
- 正式伺服器整合測試：mock upstream、匿名／偽造 session、登入欄位、CSRF、JSON 類型、密碼脫敏、cookie flags、訂單身分、商品與 query 驗證、登出失效、保護路由。
- 中英文首頁／商品／購物車／登入／帳戶／會員／API／商品新增的 SSR、canonical、noindex、安全標頭及動態 sitemap。使用本機 mock，不向外部 API 寫入。

## 尚未宣稱完成的事項與後續優先順序

1. **視覺與真實互動 QA**：本環境 Browser runtime 回報沒有可用瀏覽器；沒有完成桌面／手機截圖、鍵盤實際操作、axe、Lighthouse 或 Core Web Vitals 量測。原生 dialog、響應式配置與 reduced-motion 已做程式檢查，但仍需實機驗證；不能宣稱 UI / UX 或效能已達滿分。
2. **正式交易與多實例部署**：session 保存在單一程序記憶體，重啟會失效，未提供跨實例 session、登入速率限制、集中日誌與監控。若升級成正式服務，應先補共享 TTL session、限流與部署層 request size 限制，再做安全測試；目前的 Content-Length 檢查不是完整串流大小限制。
3. **CSP**：Nuxt hydration 與樣式仍使用 unsafe-inline；正式產品可評估 nonce/hash 整合。沒有為了消除警告而假裝已落實嚴格 CSP。
4. **字型與圖片效能**：Noto Sans TC 字型仍來自 Google；可在需要離線／隱私限制時改自託管字型。圖片受上游與 IPX 服務影響，需實際量測後再決定預載與快取策略。
5. **部署與 CI 狀態**：本次只完成本機提交，未要求 push 或部署；因此沒有宣稱遠端 CI／正式站已通過或發布。現有 public/_headers 是靜態平台的設定，不能取代 Node server routeRules；正式部署應使用 Node runtime 並確認反向代理設定。
6. **長期維護**：TypeScript 7 要等 vue-tsc 支援才移除版本限制；兩項 scoped overrides 應在上游修正後移除。可再導入 lint、瀏覽器 E2E 與覆蓋率門檻，但不把只有格式一致視為功能正確。

## 官方依據

- [Nuxt 4 TypeScript 設定](https://nuxt.com/docs/4.x/directory-structure/tsconfig)
- [Nuxt 4 升級指南](https://nuxt.com/docs/4.x/getting-started/upgrade)
- [Nuxt i18n SEO](https://i18n.nuxtjs.org/docs/guide/seo/)
- [Nuxt i18n 安裝與 Vue I18n 11](https://i18n.nuxtjs.org/docs/getting-started)
- [npm install-scripts 管理](https://docs.npmjs.com/cli/v11/commands/npm-install-scripts/)
- [Nuxt Sitemap](https://github.com/nuxt-modules/sitemap)
- [GitHub checkout](https://github.com/actions/checkout)、[setup-node](https://github.com/actions/setup-node)
