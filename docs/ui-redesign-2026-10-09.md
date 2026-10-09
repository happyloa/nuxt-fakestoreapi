# UI 更新紀錄

店面改用暖白背景、橄欖色主視覺、橘色按鈕和 Manrope 字型。首頁以 Fake Store API 的背包商品作為主圖，下方直接呈現分類、搜尋、排序與商品目錄。商品詳情、購物車、登入、帳號、使用者列表、示範商品表單及 API 操作台沿用同一套樣式。

## 互動與維護

- 中英文、深淺色、API 資料與示範購物流程持續使用原有的 Nuxt、Pinia 與 BFF。
- 手機選單使用原生 `dialog`，支援焦點限制、Escape 關閉與頁面捲動鎖定。桌面導覽、語言與主題控制集中在頁首。
- 商品分類轉為目前語言的標籤；API 分類值與 URL query 維持原有格式。
- API 操作台以三個分頁呈現資源，支援方向鍵、Home 與 End。
- 移除 AOS 相依套件與初始化程式。保留輕量的圖片 hover 效果，並尊重減少動態效果的系統設定。
- 購物車改在 `onNuxtReady` 還原，避免 Nuxt 4.6 的非同步頁面 hydration 與本機狀態同時改寫頁首內容。瀏覽器測試會在加入商品後重新整理，再檢查數量與主控台錯誤。
- 帳號頁展示本次瀏覽期間的示範結帳商品；此紀錄不寫入本機儲存，重新整理後會清空。
- Nuxt 4.6 的 Node.js 需求同步到 `package.json`、lockfile 與 README。

此次使用 [Anthropic frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design)，來源 commit 為 `683bc88e56f3e09ba94f7055977f3d3aa499f202`。文案依 humanizer 檢查，保留示範資料、付款與出貨限制。

## 素材

- 首頁背包使用 [Fake Store API 的原始商品圖片](https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png)，存於 `public/images/featured-backpack.png`，並連到實際商品 ID 1。
- Manrope 由 Google Fonts 提供，字型存於 `app/assets/fonts/manrope-latin.woff2`，由 Vite 打包。授權為 SIL Open Font License 1.1，全文保留於 `public/fonts/OFL-Manrope.txt`。此檔涵蓋拉丁字母，中文沿用系統字型。
- 圖示使用 `SiteIcon.vue` 的 SVG，不新增前端元件庫。

## 瀏覽器驗證

先建立正式版，再於另一個 PowerShell 視窗啟動：

```powershell
npm.cmd run build
$env:NITRO_HOST = '127.0.0.1'
$env:NITRO_PORT = '3008'
node .output/server/index.mjs
```

首次執行需安裝 Playwright 瀏覽器：

```powershell
npx.cmd playwright install chromium
npm.cmd run test:ui
```

也可使用已安裝的 Chrome：

```powershell
$env:UI_BROWSER_CHANNEL = 'chrome'
npm.cmd run test:ui
```

`UI_TEST_URL` 可指定其他正式預覽網址。測試需要存取公開的 Fake Store API，使用公開示範帳號登入並在本站完成示範結帳。測試產生的截圖、axe 報告與主控台錯誤紀錄存於被 Git 忽略的 `.cache/ui-screenshots`。

檢查涵蓋 20 件商品載入、分類與搜尋、價格排序、購物車數量與重整保留、登入返回購物車、示範結帳、帳號收據、商品詳情、使用者列表、商品表單、API 分頁鍵盤操作、中英文切換、深淺色、手機選單及 404。主要頁面在 320、390、768、1440px 檢查水平溢出，axe 檢查 WCAG 2 A/AA 與 WCAG 2.1 AA 的可自動化規則。

2026-10-09 在 Windows、Node.js 24.21.0、npm 12.2.0 與 Chrome headless 的正式預覽上完成驗證：乾淨 `npm ci`、7 項安全測試、修補驗證 audit、型別檢查、正式建置及 UI smoke 均通過。13 組 axe 檢查沒有違規；購物流程的主控台沒有執行錯誤或 hydration mismatch。已檢視桌面、深色與手機截圖，包含有商品的帳號收據。

自動化檢查涵蓋上述範圍；完整無障礙評估仍需要人工及輔助科技操作。
