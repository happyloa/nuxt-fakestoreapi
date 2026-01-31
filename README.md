# Fake Store API | 假商店資料串接練習

一個基於 Nuxt 4 與 Tailwind CSS v4 的示範專案，串接 [Fake Store API](https://fakestoreapi.com/)，完整展現電子商務流程：商品目錄、商品建立、購物車同步與使用者管理，同時提供可重複使用的 Vue 元件與多語系支援。

![縮圖](https://github.com/happyloa/nuxt-fakestoreapi/blob/main/public/thumb.webp?raw=true)

## ✨ 特色亮點

### 商品體驗

- **豐富的目錄介面**：具備 Hero Section 版面、分析卡片與響應式網格，全部以 Tailwind CSS 呈現。
- **強大的篩選功能**：結合關鍵字搜尋、分類篩選與排序，並以 URL 參數同步狀態。
- **商品建立流程**：透過 Fake Store API 的即時 POST 請求建立商品。
- **詳細頁面**：專屬商品頁提供評價、價格與快速加入購物車的操作。

### 購物車

- **API 同步的購物車**：使用示範帳號登入即可載入並保存來自 Fake Store API 的購物車資料。
- **數量管理**：支援增加、減少與刪除品項，立即更新總計。
- **訂單摘要**：響應式側邊欄整理品項與金額。

### 使用者管理

- **使用者通訊錄**：瀏覽 Fake Store API 使用者，並附上聯絡資訊與地址。
- **搜尋功能**：可依姓名、使用者名稱或電子郵件進行過濾。

### 國際化與 UI 系統

- **雙語支援**：透過 `@nuxtjs/i18n` 提供繁體中文與英文介面。
- **可組合的 UI 元件庫**：提供按鈕、卡片、輸入框、下拉選單、文字區塊、徽章、警示與標題等基礎元件。
- **響應式版面**：黏性標頭、毛玻璃背景，以及遍佈全站的 Tailwind 設計語彙。

### API 操作區與體驗優化

- **互動式 API 操作區**：涵蓋商品、購物車與使用者等 Fake Store API 端點，搭配表單輔助與即時 JSON 回應。
- **通知提示**：針對購物車、登入與管理操作提供成功／資訊提示。
- **載入骨架與空狀態**：以骨架畫面與友善的空狀態改善感知效能，首頁串接時也會優先顯示 Skeleton。

### 架構整理亮點

- **`services/` 服務層**：集中管理所有 Fake Store API 呼叫，日後可在單一入口加入攔截器或快取策略。
- **`composables/` 可組合函式**：例如 `useProductFilters` 將查詢參數與過濾邏輯封裝，維持頁面程式碼純淨。
- **繁中註解與說明**：核心頁面、Store 與元件皆附上繁體中文註解，方便檢視與展示。

## 🧱 使用技術

- [Nuxt 4.3](https://nuxt.com/) 與最新的 Nitro 執行環境。
- [Tailwind CSS v4](https://tailwindcss.com/)，採用 CSS-first 配置方式，透過 `@tailwindcss/vite` 整合。
- 以 [Pinia](https://pinia.vuejs.org/) 建立的商品、購物車、認證與使用者狀態管理。
- 使用 [@nuxtjs/i18n](https://i18n.nuxtjs.org/) 進行在地化，根路徑預設中文介面（無 /zh），英文頁面才以 `/en` 呈現，且非中文瀏覽器自動顯示英文。
- 元件、狀態與可組合函式全面採用 TypeScript。

## 🚀 快速開始

```bash
# 安裝相依套件
npm install

# 啟動開發伺服器
npm run dev

# 建置正式版本
npm run build

# 預覽正式版本
npm run preview
```

Fake Store API 提供公開的示範帳號，登入表單已預填官方範例：

```
username: mor_2314
password: 83r5^_
```

## 📁 專案結構

```
.
├─ app/                     # Nuxt 4 app router 根目錄
│  ├─ app.vue               # 應用程式外殼，包含標頭、頁尾與容器
│  ├─ assets/css/tailwind.css  # Tailwind v4 CSS-first 配置
│  ├─ components/           # UI 模組：auth、cart、layout、products、ui、users 等
│  ├─ composables/          # 可重複使用的業務邏輯（例如商品篩選）
│  ├─ layouts/              # Nuxt 版型（預設/子版型）
│  ├─ routes/               # 新 app router 路由（目錄、商品詳情、購物車、登入、使用者、建立商品）
│  ├─ services/             # Fake Store API 呼叫封裝（products、carts、users、auth）
│  ├─ stores/               # Pinia 狀態（認證、購物車、商品、使用者、通知）
│  ├─ types/                # Fake Store API 型別定義
│  └─ i18n/                 # zh 與 en 翻譯檔與 i18n 設定
├─ public/                  # 靜態資源（英雄插圖、favicon、Open Graph 圖）
└─ nuxt.config.ts           # Nuxt 設定（模組、i18n、Vite + Tailwind v4）
```

## 🔌 Fake Store API 覆蓋範圍

- `GET /products`、`GET /products/:id`、`GET /products?limit=`：商品目錄、詳情與篩選查詢。
- `GET /products/categories`、`GET /products/category/:category`：動態篩選與分類頁面。
- `POST /products`、`PUT /products/:id`、`DELETE /products/:id`：新增、更新與刪除商品。
- `GET /auth/login`：使用者驗證與 JWT 取得。
- `GET /carts`、`GET /carts/:id`、`GET /carts/user/:id`：瀏覽購物車歷史與詳情。
- `POST /carts`、`PUT /carts/:id`、`DELETE /carts/:id`：建立、更新與刪除購物車資料。
- `GET /users`、`GET /users/:id`：使用者列表與個別檔案。
- `POST /users`、`PUT /users/:id`、`DELETE /users/:id`：在操作區內完整管理使用者。

## 🛠️ 開發備註

- UI 元件皆模組化，方便維護與擴充。
- Tailwind CSS v4 採用 CSS-first 配置方式，自訂主題定義於 `app/assets/css/tailwind.css` 的 `@theme` 區塊中。
- Pinia store 提供載入與錯誤狀態，讓頁面邏輯保持宣告式。
- 國際化字串位於 `/app/i18n/locales`，以語意化命名空間組織。
- Toast 通知由專用的 Pinia store 管理，並透過全域 `<ToastContainer />` 元件渲染。

歡迎依需求調整版面、擴充 API 覆蓋範圍，或在自己的專案中沿用這些 UI 元件！
