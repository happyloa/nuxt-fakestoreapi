# Fake Store Experience

A Nuxt 4 playground that integrates every endpoint of the [Fake Store API](https://fakestoreapi.com/). The project ships with a refreshed Tailwind CSS interface, rich product browsing tools, cart synchronisation, user exploration, and a guided flow for creating new products via the API.

![Fake Store Experience hero](https://i.imgur.com/mIOKP43.png)

## ✨ Highlights

- **Nuxt 4 + Tailwind CSS** – modern application structure with composables, layouts, and utility-first styling.
- **Full API coverage** – browse products, create new items, authenticate demo users, manage carts, and inspect user profiles.
- **Internationalisation** – ready-to-use Traditional Chinese and English translations with @nuxtjs/i18n.
- **SSR-friendly data layer** – `useAsyncData` + a typed Fake Store client composable keeps data fetching centralised and reusable.
- **Pinia-powered cart & auth** – cart state persists locally and syncs with the Fake Store API once a demo user signs in.

## 🗂️ Project structure

```
├─ app.vue                 # Nuxt app entry – layout orchestration & meta tags
├─ assets/css/main.css     # Tailwind layer definitions & design tokens
├─ components/             # Shared UI components (header, footer, cards)
├─ composables/            # `useFakeStoreClient` for typed API requests
├─ layouts/default.vue     # Global shell with header/footer
├─ locales/                # i18n strings (en, zh)
├─ pages/
│  ├─ index.vue            # Marketing overview + featured products
│  ├─ products/            # Listing, product details, creation form
│  ├─ cart.vue             # Cart management & API sync
│  ├─ login.vue            # Demo account sign in
│  └─ users/               # User directory & profile pages
├─ stores/                 # Pinia stores for auth & cart logic
├─ tailwind.config.ts      # Tailwind configuration exposed via Nuxt module
└─ types/                  # TypeScript contracts for Fake Store entities
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
   ```
4. **Preview the production bundle**
   ```bash
   npm run preview
   ```

> ℹ️  Nuxt 4 requires Node.js 18.20+, 20.9+, or 22+. Tailwind CSS configuration is provided via `@nuxtjs/tailwindcss`, so no extra build steps are necessary.

## 🔌 Fake Store features

| Feature | Description |
| --- | --- |
| Product catalogue | Client-side filtering, category chips, name sorting, and instant cart actions powered by `useFakeStoreClient`. |
| Product detail | Rich product pages with related-item recommendations. |
| Product creation | A Tailwind form validated with Zod sends `POST /products` and redirects to the new detail page. |
| Authentication | Demo login via `POST /auth/login` hydrates the Pinia auth store. |
| Cart sync | Adding items works offline; once authenticated, cart contents sync with `POST /carts` and previous carts are fetched for the logged-in user. |
| User explorer | Browse members, view contact details, and inspect their historic carts. |

## 🧩 Key files

- `composables/useFakeStoreClient.ts` – typed wrapper around the Fake Store API.
- `stores/cart.ts` – handles cart state, local persistence, and sync jobs.
- `stores/auth.ts` – manages demo user sessions and hydrates carts on login.
- `pages/products/new.vue` – showcases form validation + API POST requests.
- `pages/cart.vue` – Tailwind UI with totals, quantity controls, and sync feedback.

## 🌐 Internationalisation

The project uses `@nuxtjs/i18n` in lazy mode. Add new locales inside `locales/` and register them in `nuxt.config.ts`. Strings follow a nested namespace pattern (e.g. `home.actions.browseProducts`).

## 🧱 Styling system

Tailwind CSS is configured via `tailwind.config.ts`, extending colours, fonts, and shadows. Shared component classes (e.g. `.card`, `.link-button`) live in `assets/css/main.css` using Tailwind layers for consistent visuals.

## 🔒 Demo credentials

Fake Store exposes public demo users. Visit **Users → View profile** to copy a username/password combination (e.g. `johnd` / `m38rmF$`) and sign in through the **Login** page. Once authenticated, cart data syncs automatically.

## 📄 License

This project is provided for educational purposes. Fake Store API data is public and may reset at any time.
