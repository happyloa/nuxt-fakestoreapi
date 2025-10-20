# Nuxt Fake Store Showcase

A polished Nuxt 4 application that integrates the [Fake Store API](https://fakestoreapi.com/) to demonstrate a complete e-commerce workflow. The project has been refreshed with Tailwind CSS, modular UI components, authenticated cart synchronisation, user management and product creation.

![Nuxt Fake Store preview](https://i.imgur.com/mIOKP43.png)

## ✨ Features

- **Product catalogue** – filter, search and sort products by category or price with instant UI feedback.
- **Product creation** – submit new items to the Fake Store API with validation feedback and automatic redirect to the created record.
- **Dynamic product pages** – rich product detail views with rating badges and “add to cart” actions.
- **Shopping cart** – synchronised with Fake Store carts after login, including quantity management and summary cards.
- **User explorer** – browse all Fake Store users, inspect their profile details and review historical carts.
- **Internationalisation** – toggle between Traditional Chinese and English with translated navigation, copy and CTAs.
- **Modern UI** – Tailwind CSS driven layout, responsive typography, soft glassmorphism panels and dark theme.

## 🧱 Project structure

```
├── app.vue                     # Application shell with header, footer and layout
├── components
│   ├── cart                    # Cart specific components (rows, summaries)
│   ├── products                # Product cards, filters, hero blocks and forms
│   ├── users                   # User list and detail components
│   ├── AppHeader.vue           # Responsive navigation bar
│   ├── AppFooter.vue           # Footer with quick links
│   └── LanguageSwitcher.vue    # Floating locale toggle
├── composables/useFakeStoreApi.ts  # Centralised Fake Store API client
├── i18n/locales                # i18n strings (English & Traditional Chinese)
├── pages
│   ├── index.vue               # Landing page with highlights and quick actions
│   ├── cart/index.vue          # Cart management page
│   ├── login.vue               # Authentication form for demo credentials
│   ├── products                # Catalogue list, detail and creation routes
│   └── users                   # User list and detail routes with cart history
├── stores                      # Pinia stores for auth & cart synchronisation
├── assets/css/main.css         # Tailwind layers and design tokens
├── tailwind.config.ts          # Tailwind theme customisation
└── nuxt.config.ts              # Nuxt 4 configuration & module setup
```

## 🚀 Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

> ℹ️ The Fake Store API ships with demo credentials such as `mor_2314` / `83r5^_`. Use them to experience cart persistence and user-specific data.

## 🧩 Tech stack

- [Nuxt 4](https://nuxt.com/) with server-side rendering
- [Tailwind CSS](https://tailwindcss.com/) and `@tailwindcss/forms` / `@tailwindcss/typography`
- [Pinia](https://pinia.vuejs.org/) state management for cart and authentication
- [@nuxtjs/i18n](https://i18n.nuxtjs.org/) for bilingual support
- [Fake Store API](https://fakestoreapi.com/) as the back-end data source

## 🔐 API coverage

| Capability           | Implementation |
|----------------------|----------------|
| Fetch all products   | Landing page & `/products` grid |
| Fetch product detail | `/products/[id]` detail page |
| Create product       | `/products/new` form with success feedback |
| Authenticate user    | `/login` Pinia auth store |
| Sync shopping cart   | Cart store backed by Fake Store cart endpoints |
| Fetch users          | `/users` list and `/users/[id]` detail views |
| Fetch user carts     | User detail page cart history section |

## 🧪 Testing checklist

- Login using a demo account, refresh the page and confirm the cart persists.
- Create a product and follow the redirect to its detail page.
- Switch languages and verify navigation, headings and call-to-actions update accordingly.
- Resize the window to confirm responsive behaviour on tablets and mobiles.

Enjoy exploring the Fake Store API with a modern Nuxt experience! 🎉
