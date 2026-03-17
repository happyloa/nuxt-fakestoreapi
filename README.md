# Fake Store API | 假商店資料串接練習

一個基於 Nuxt 4 與 Tailwind CSS v4 的示範專案，串接 [Fake Store API](https://fakestoreapi.com/)，完整展現電子商務流程：商品目錄、商品建立、購物車同步、帳號管理與使用者通訊錄，同時提供可重複使用的 Vue 元件與多語系支援。

![縮圖](https://github.com/happyloa/nuxt-fakestoreapi/blob/main/public/thumb.webp?raw=true)

## ✨ 特色亮點

### 商品體驗

- **豐富的目錄介面**：具備 Hero Section 版面、統計卡片（`BaseStatCard`）與響應式網格，全部以 Tailwind CSS 呈現。
- **強大的篩選功能**：結合關鍵字搜尋、分類篩選與排序，並以 URL 參數同步狀態（`useProductFilters` composable）。
- **商品建立流程**：透過 Fake Store API 的即時 POST 請求建立商品。
- **詳細頁面**：專屬商品頁提供評價、價格與快速加入購物車的操作。

### 購物車

- **API 同步的購物車**：使用示範帳號登入即可載入並保存來自 Fake Store API 的購物車資料。
- **數量管理**：支援增加、減少與刪除品項，立即更新總計。
- **訂單摘要**：響應式側邊欄整理品項與金額。
- **登出自動清空**：登出時自動清除購物車資料，避免殘留。

### 帳號管理

- **個人帳號頁**：登入後可查看個人資料（使用者名稱、姓名、Email、電話）、送貨地址與最近訂單紀錄。
- **頭像縮寫**：自動從使用者姓名取首字母作為頭像顯示。
- **最近訂單**：顯示購物車品項縮圖、名稱、數量與小計，最多顯示 3 筆。

### 使用者管理

- **使用者通訊錄**：瀏覽 Fake Store API 使用者，並附上聯絡資訊與地址。
- **搜尋功能**：可依姓名、使用者名稱或電子郵件進行過濾。

### 國際化與 UI 系統

- **雙語支援**：透過 `@nuxtjs/i18n` 提供繁體中文與英文介面。
- **可組合的 UI 元件庫**：提供按鈕、卡片、輸入框、下拉選單、文字區塊、徽章、警示、統計卡片、載入器與標題等基礎元件。
- **深色模式**：支援淺色、深色與系統偏好三種主題切換，搭配浮動切換按鈕與平滑過渡動畫。
- **響應式版面**：黏性標頭搭配毛玻璃背景、漸層 Logo、滑入式行動選單（斷點 1024px），以及遍佈全站的 Tailwind 設計語彙。

### 動畫與體驗優化

- **AOS 滾動動畫**：全站整合 Animate On Scroll，透過 `aos.client.ts` 插件統一設定，所有頁面與元件均具備進場動畫。
- **回到頂端按鈕**：偵測捲動位置，自動顯示的 `BackToTop` 浮動按鈕，搭配淡入縮放過渡動畫。
- **頁面過渡**：Nuxt 路由切換時具備滑入淡出的 page transition 效果。
- **互動微動畫**：按鈕 hover 發光、卡片 hover 上浮、圖片 hover 放大、Logo 漸層色彩、浮動裝飾圓形動畫等。
- **防閃爍機制**：透過 `transition-ready` class 延遲套用過渡效果，避免主題或語言切換時的 FOUC 問題。
- **自訂錯誤頁面**：`error.vue` 提供友善的 404／通用錯誤畫面並支援返回首頁。

### API 操作區

- **互動式 API 操作區**：涵蓋商品、購物車與使用者等 Fake Store API 端點，搭配表單輔助與即時 JSON 回應。
- **通知提示**：針對購物車、登入與管理操作提供成功／資訊提示（Toast 通知由 `useNotificationsStore` 管理）。
- **載入骨架與空狀態**：以骨架畫面（`ProductGridSkeleton`）與友善的空狀態（`ProductEmptyState`）改善感知效能。

### 架構整理亮點

- **語意化 HTML**：全面採用 `article`、`section`、`figure`、`hgroup`、`address`、`dl`/`dt`/`dd` 等語意標籤，搭配 ARIA 屬性提升無障礙體驗。
- **`services/fakestore/` 服務層**：以獨立的 `client.ts` 作為基底 HTTP 客戶端，`products.ts`、`carts.ts`、`users.ts`、`auth.ts` 分模組封裝 API 呼叫，日後可在單一入口加入攔截器或快取策略。
- **`composables/` 可組合函式**：例如 `useProductFilters` 將查詢參數與過濾邏輯封裝，維持頁面程式碼純淨。
- **安全性標頭**：透過 Nitro `routeRules` 全站套用 `Content-Security-Policy`、`Strict-Transport-Security`、`X-Frame-Options` 等完整 HTTP 安全性標頭。
- **繁中註解與說明**：核心頁面、Store 與元件皆附上繁體中文註解，方便檢視與展示。

## 🧱 使用技術

- [Nuxt 4.4.2](https://nuxt.com/) 與最新的 Nitro 執行環境。
- [Tailwind CSS v4](https://tailwindcss.com/)，採用 CSS-first 配置方式，透過 `@tailwindcss/vite` 整合。
- 以 [Pinia](https://pinia.vuejs.org/) 建立的商品、購物車、認證、使用者、通知與主題狀態管理（共 6 個 Store）。
- 使用 [@nuxtjs/i18n](https://i18n.nuxtjs.org/) 進行在地化，根路徑預設中文介面（無 `/zh`），英文頁面才以 `/en` 呈現，且非中文瀏覽器自動顯示英文。
- 使用 [@nuxt/image](https://image.nuxt.com/) 進行圖片最佳化，支援外部圖片網域。
- 使用 [@nuxtjs/google-fonts](https://google-fonts.nuxtjs.org/) 載入 `Noto Sans TC` 字型（100～900 字重）。
- [AOS](https://michalsnik.github.io/aos/) 提供滾動觸發的進場動畫。
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
├─ app/                        # Nuxt 4 app router 根目錄
│  ├─ app.vue                  # 應用程式外殼，包含 SEO、Loading Indicator 與 Layout
│  ├─ error.vue                # 自訂錯誤頁面（404 / 通用錯誤）
│  ├─ assets/css/tailwind.css  # Tailwind v4 CSS-first 配置與自訂主題
│  ├─ components/              # UI 模組
│  │  ├─ api/                  # API 操作區元件（ApiOperationCard、ApiResultViewer、ProductsSection、CartsSection、UsersSection）
│  │  ├─ auth/                 # 認證元件（LoginForm）
│  │  ├─ cart/                 # 購物車元件（CartItemsList、CartSummary）
│  │  ├─ layout/               # 版面元件（SiteHeader、SiteFooter、ThemeToggle、LanguageSwitcher）
│  │  ├─ products/             # 商品元件（ProductCard、ProductGrid、ProductHero、ProductDetail、ProductFilterPanel、ProductForm、ProductGridSkeleton、ProductEmptyState、ProductStats）
│  │  ├─ ui/                   # 基礎 UI 元件（BaseButton、BaseCard、BaseInput、BaseSelect、BaseTextarea、BaseBadge、BaseAlert、BaseStatCard、BaseLoader、BaseSectionHeading、BackToTop、ToastContainer）
│  │  └─ users/                # 使用者元件（UserCard、UserList）
│  ├─ composables/             # 可重複使用的業務邏輯（useProductFilters）
│  ├─ layouts/                 # Nuxt 版型（預設版型含頁面過渡動畫）
│  ├─ pages/                   # 頁面路由
│  │  ├─ index.vue             # 首頁（商品目錄、篩選、統計）
│  │  ├─ product/[id].vue      # 商品詳情頁
│  │  ├─ products/new.vue      # 新增商品
│  │  ├─ cart.vue              # 購物車
│  │  ├─ login.vue             # 登入
│  │  ├─ account.vue           # 帳號（個人資料、地址、最近訂單）
│  │  ├─ users.vue             # 使用者通訊錄
│  │  └─ api.vue               # API 互動操作區
│  ├─ plugins/                 # 客戶端插件（theme.client、i18n-locale.client、aos.client）
│  ├─ services/fakestore/      # Fake Store API 呼叫封裝
│  │  ├─ client.ts             # 基底 HTTP 客戶端
│  │  ├─ products.ts           # 商品端點
│  │  ├─ carts.ts              # 購物車端點
│  │  ├─ users.ts              # 使用者端點
│  │  └─ auth.ts               # 認證端點
│  ├─ stores/                  # Pinia 狀態（auth、cart、products、users、notifications、theme）
│  ├─ types/                   # TypeScript 型別定義（fakestore.ts、aos.d.ts）
│  └─ i18n/locales/            # zh.json 與 en.json 翻譯檔
├─ public/                     # 靜態資源（og-image.webp、thumb.webp、favicon.ico、hero-products.svg 等）
├─ nuxt.config.ts              # Nuxt 設定（模組、i18n、Vite + Tailwind v4、Nitro 安全性標頭）
└─ tsconfig.json               # TypeScript 設定
```

## 🔌 Fake Store API 覆蓋範圍

- `GET /products`、`GET /products/:id`、`GET /products?limit=`：商品目錄、詳情與篩選查詢。
- `GET /products/categories`、`GET /products/category/:category`：動態篩選與分類頁面。
- `POST /products`、`PUT /products/:id`、`DELETE /products/:id`：新增、更新與刪除商品。
- `POST /auth/login`：使用者驗證與 JWT 取得。
- `GET /carts`、`GET /carts/:id`、`GET /carts/user/:id`：瀏覽購物車歷史與詳情。
- `POST /carts`、`PUT /carts/:id`、`DELETE /carts/:id`：建立、更新與刪除購物車資料。
- `GET /users`、`GET /users/:id`：使用者列表與個別檔案。
- `POST /users`、`PUT /users/:id`、`DELETE /users/:id`：在操作區內完整管理使用者。

## 🛡️ 安全性

透過 Nitro `routeRules` 對全站路由套用以下 HTTP 安全性標頭：

| 標頭 | 說明 |
|------|------|
| `Content-Security-Policy` | 防止 XSS，嚴格限制腳本、樣式、圖片與連線來源 |
| `Strict-Transport-Security` | 強制 HTTPS，有效期 2 年並含子網域 |
| `X-Frame-Options` | 禁止 iframe 嵌入（DENY） |
| `X-Content-Type-Options` | 防止 MIME 類型嗅探 |
| `Referrer-Policy` | 嚴格的來源政策 |
| `Permissions-Policy` | 關閉相機、麥克風、地理位置等瀏覽器功能 |
| `Cross-Origin-Opener-Policy` | 防止跨來源視窗存取 |

## 🛠️ 開發備註

- UI 元件皆模組化，方便維護與擴充。元件路徑前綴已移除，可直接以元件名稱使用（例如 `<ProductCard />`）。
- Tailwind CSS v4 採用 CSS-first 配置方式，自訂主題定義於 `app/assets/css/tailwind.css` 的 `@theme` 區塊中。
- Pinia store 提供載入與錯誤狀態，讓頁面邏輯保持宣告式。
- 國際化字串位於 `app/i18n/locales/`，以語意化命名空間組織（`zh.json` / `en.json`）。
- Toast 通知由 `useNotificationsStore` 管理，並透過全域 `<ToastContainer />` 元件渲染。
- 全站使用語意化 HTML 標籤與 ARIA 屬性，符合無障礙網頁標準。
- 部署網域須設定於 `NUXT_PUBLIC_SITE_URL` 環境變數，供 i18n SEO 標籤使用。

歡迎依需求調整版面、擴充 API 覆蓋範圍，或在自己的專案中沿用這些 UI 元件！
