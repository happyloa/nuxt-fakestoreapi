![](https://i.imgur.com/mIOKP43.png)

# Nuxt FakeStoreAPI 商品資料串接練習

此專案為一個基於 Nuxt 3 的電子商務展示平台，整合了 FakeStoreAPI 作為產品資料來源。專案中包含多國語言支援、產品分類篩選、搜尋與排序功能，並使用 Vue 元件來實現可重複使用的 UI 設計。

- [線上部署連結](https://nuxt-fakestoreapi.worksbyaaron.com/)

## 目錄結構

```
├── .gitignore               # 定義版本控制時忽略的檔案
├── .vscode/settings.json    # VS Code 設定
├── README.md                # 專案說明文件
├── app.vue                  # Vue 主應用程式檔案
├── assets/css               # 樣式檔案（字型與重設樣式）
├── components               # 自訂 Vue 元件
│   ├── AppFooter.vue        # 頁尾元件
│   ├── AppHeader.vue        # 頁首元件
│   ├── Home                 # 主頁元件（篩選、標題、產品卡片）
│   └── LanguageSwitcher.vue # 語言切換元件
├── i18n.config.ts           # 多國語言設定
├── locales                  # 語系檔（英文與繁體中文）
├── nuxt.config.ts           # Nuxt 設定檔
├── pages                    # Nuxt 頁面路由
│   ├── index.vue            # 主頁
│   └── product/[id].vue     # 產品詳細頁
├── public                   # 靜態資源（favicon、語言圖示、SEO 資訊）
├── server                   # 伺服器端設定
└── tsconfig.json            # TypeScript 設定
```

## 安裝與運行步驟

1.安裝套件：

    npm install

2.啟動開發伺服器：

    npm run dev

## 主要功能

- **多國語言支援**：提供繁體中文與英文語系切換。
- **產品分類篩選**：依產品分類篩選顯示。
- **產品搜尋與排序**：提供關鍵字搜尋功能及產品列表排序。
- **動態路由**：根據 API 資料動態生成產品詳細頁面。
- **SEO 優化**：針對每個頁面設定 SEO 元數據，包括標題與描述。

## 檔案與功能介紹

### `/components`

包含主要的 UI 元件，用於頁面組成的基本區塊：

- **AppHeader.vue** 和 **AppFooter.vue**：定義頁首與頁尾。
- **Home/Filter.vue**：用於篩選商品的元件，包含分類選擇、排序及搜尋框。
- **Home/ProductCard.vue**：商品卡片顯示，包含圖片、標題及價格等。
- **LanguageSwitcher.vue**：語言切換元件，提供英文與繁體中文。

### `/pages/index.vue`

主頁功能介紹：

- **資料抓取**：使用 `useFetch` 從 FakeStoreAPI 獲取商品資料，顯示在頁面上。
- **篩選、搜尋與排序**：根據 URL 查詢參數進行商品顯示篩選，支援按分類、排序、搜尋關鍵字來顯示產品。
- **SEO 設定**：設置頁面 SEO 元數據，利於搜尋引擎優化。

### `/pages/product/[id].vue`

產品詳細頁面：

- **動態路由**：根據產品 ID 從 FakeStoreAPI 獲取特定產品資料。
- **評價顯示**：使用星級表示法顯示產品評價。
- **SEO 設定**：針對每個產品的名稱設定標題與描述。

### `nuxt.config.ts`

Nuxt 的主要設定檔，用於設置多國語言、伺服器端渲染及路由設定。

### `/locales`

語系檔，包含 `en.json` 與 `zh.json`，為應用程式提供英文與繁體中文的介面。

### `package.json`

列出使用的套件與執行指令，包括：

- **@nuxtjs/i18n**：多國語言支援套件。
- **@nuxtjs/google-fonts**：用於載入 Google 字型。
- **vue-router**：Vue 路由管理。
