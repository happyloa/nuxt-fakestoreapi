# 套件更新與安全修補

Nuxt 更新至 4.6.0、Sitemap 至 8.6.1、Vue Router 至 5.4.0、Vue i18n 至 11.4.13、vue-tsc 至 3.3.12，並更新 `package.json` 的版本範圍及 `package-lock.json`。開發環境使用 Node.js 24.21.0、npm 12.2.0。

## 相容性限制

- `h3` 保留 1.15.11：Nuxt 4.6.0 的 Nitro 整合仍使用 H3 1.x。本站的 request body 與 session 處理也依賴這個版本的事件介面。
- TypeScript 保留 6.0.3：7.0.2 搭配 vue-tsc 3.3.12 實測會出現 `ERR_PACKAGE_PATH_NOT_EXPORTED`，因為 vue-tsc 仍讀取 `typescript/lib/tsc`。
- `simple-git` 透過 override 使用 4.0.2，修復 Nuxt DevTools 間接引入的命令執行漏洞。其 argv-parser 使用修正版 2.0.1。
- `patches/@nuxt+devtools+3.4.2.patch` 將 DevTools 的 `simple-git` 預設匯入改為 4.x 支援的具名 `simpleGit` 匯入，讓開發模式能使用安全版本。
- Nitro 的 inline 規則加入同時支援 Windows 與 Unix 路徑分隔符的 Nuxt renderer 匹配，避開 Nuxt 4.6.0 在 Windows 將 renderer 留為 external、導致 SSR 500 的問題，見 [Nuxt #36467](https://github.com/nuxt/nuxt/issues/36467)。
- Vite 排除 `@nuxtjs/i18n` 的 dependency pre-bundling，避開 4.6.0 在 dependency scan 解析 `#components` 失敗的問題，見 [i18n #4162](https://github.com/nuxt-modules/i18n/issues/4162)。
- 正式建置的 Nitro inline 規則也包含 `pinia`。Windows 上 Vite 將 Nuxt plugin 的 Pinia 匯入解析成絕對路徑，stores 則保留套件名稱；若只內嵌其中一份，會形成兩份執行個體並在 SSR 出現 `getActivePinia()` 錯誤。瀏覽器驗證會檢查正式首頁回應 200。

## 未有官方修正版的漏洞

截至 2026-10-09，以下兩個套件尚無已發布的官方修正版：

- [braces：GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)。`patches/braces+3.0.3.patch` 限制 parser 與直接 AST 操作的深度，拒絕循環 AST，避免遞迴耗盡 call stack。一般 glob、範圍、跳脫字元與巢狀模式有回歸測試。
- [node-forge：GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv)。`patches/node-forge+1.4.0.patch` 檢查 RSA PKCS#1 v1.5 DigestAlgorithm 的元素數及 NULL 參數，拒絕額外 ASN.1 元素。測試涵蓋正常簽章、可省略的參數與畸形結構。

`postinstall` 在 Nuxt prepare 前執行 `patch-package --error-on-fail`。修補版本或原始碼不符時安裝會失敗，避免默默失去修補。`scripts/security-patches.json` 保存已審閱檔案的 SHA-256；安全檢查會驗證 lockfile 中每份套件的版本與安裝內容。

原始 `npm audit` 仍會標記這兩個上游版本及其相依鏈，因此不能宣稱原始報告為零漏洞。升級後報告為 15 個 high、0 個 critical，底層原因僅剩上述兩項。`npm run audit:security` 只接受這兩個經檔案驗證的修補；出現其他 advisory、缺少修補、額外未修補的副本或 audit 服務失敗都會讓檢查失敗。這是本機 mitigation，不是上游已修復。

重新驗證：

```bash
npm ci
npm run test:security
npm run audit:security
npm run typecheck
npm run build
```

上游發布修正版後，應更新套件、移除對應 patch 與審閱紀錄，再重新執行這些檢查。
