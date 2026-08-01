# Storefront Lab

Storefront Lab 是以 [Fake Store API](https://fakestoreapi.com/) 為資料來源的 Nuxt 示範店面。它用一個可瀏覽、搜尋、篩選、加入購物車與登入的前台，示範如何把第三方 API 收斂在 Nuxt 的安全邊界內，而不是把 API 呼叫、登入狀態與畫面邏輯混在一起。

這不是正式電商系統，也不處理真實付款、出貨或訂單。Fake Store API 提供的是公開假資料；其新增、修改、刪除與購物車請求可能會回傳示範結果，但不代表資料會永久保存。請勿將此專案用於真實交易或輸入敏感資料。

## 功能範圍

- 商品目錄、分類、搜尋、排序與商品詳情
- 本機購物車、數量調整與示範結帳流程
- Fake Store API 登入與帳戶資料展示
- 繁體中文與 English 介面
- 深色模式、響應式版面與基本無障礙支援

## 重要的資料與安全說明

- 商品、使用者與購物車資料皆來自 Fake Store API 的假資料。
- 訂單僅為示範收據；不會建立真實訂單，也不保證上游 API 的 mutation 會持久化。
- 購物車以瀏覽器本機儲存為主，讓示範流程在重新整理後仍可延續；它不是跨裝置同步的訂單系統。
- 前端不保存、顯示或回傳使用者密碼。登入資料只會用於向上游 API 建立工作階段。
- 上游 token 只在伺服器登入流程中短暫使用；BFF 會改寫為隨機、不透明的伺服器端 demo session，並以 `HttpOnly`、`Secure`、`SameSite=Lax` cookie 保存識別碼，瀏覽器 JavaScript 無法直接讀取或偽造使用者身分。示範 session 只留在目前伺服器程序的記憶體中，重新部署或重啟後會失效。

## 架構原則

專案採用以領域分組的模組化單體架構：頁面只負責路由與組裝，商品、購物車、帳戶與站台殼層各自擁有清楚的元件與互動邏輯；共用 DTO 則集中管理。

```text
app/
  components/
    catalog/          # 目錄、篩選、商品卡與詳情
    cart/             # 購物車明細與摘要
    auth/             # 示範登入表單
    shell/            # Header、Footer、語言與主題控制
  composables/        # local cart、session、URL query、theme
  pages/              # 薄頁面層：路由、SEO、頁面組裝
  layouts/            # 應用程式殼層
  types/              # 瀏覽器可安全使用的 DTO
  assets/styles/      # 設計 token 與全域樣式
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

這讓元件不需要知道第三方 API 的 URL、token 格式或錯誤細節，也能避免直接把上游資料模型散落在 UI 中。

### 前端資料流

- 商品與分類屬於可 SSR 的遠端資料，透過 `useAsyncData`／`useFetch` 取得並以明確 cache key 管理。
- 購物車、主題、通知與選單等純前端狀態才使用 client state。
- 篩選條件同步到 URL，便於重新整理、分享與返回瀏覽。
- 示範結帳只在本站建立收據，不對 Fake Store API 發送 mutation；這讓介面行為與上游的非持久化特性一致。

## 介面與可近用性

介面以語意化 HTML 與可重用的領域元件建立，並遵守下列原則：

- 可使用鍵盤操作導覽、表單、drawer、對話框與通知。
- 清楚的焦點樣式、跳至主要內容連結與正確的 ARIA 標示。
- 對 loading、空資料、錯誤與操作成功提供可理解的回饋。
- 尊重 `prefers-reduced-motion`，避免不必要的強制動畫。
- 提供繁體中文（預設）與 English；日期、貨幣與數量依 locale 格式化。

## 系統需求

- Node.js `^22.19.0 || ^24.11.0 || >=26.0.0`
- npm（隨 Node.js 安裝）

建議使用目前支援中的 Node.js LTS 版本。可先以 `node --version` 確認版本。

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

## 貢獻原則

- 不要從瀏覽器直接呼叫 Fake Store API；請透過 BFF 增加或調整端點。
- 不要把密碼、token 或含有敏感欄位的上游 DTO 放進前端 state、log 或畫面。
- 為新功能建立自己的 feature 邊界，避免跨 feature 直接讀寫內部 state。
- 新增可見文字時，同步補上繁中與英文翻譯，並保留鍵盤與螢幕閱讀器可用性。

## 授權與資料來源

本專案使用 Fake Store API 作為示範資料來源；其資料與行為以該服務的規範為準。請參考 [Fake Store API](https://fakestoreapi.com/) 了解其使用方式與限制。
