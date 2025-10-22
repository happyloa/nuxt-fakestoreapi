# Fake Store Dashboard

A Nuxt 4 + Tailwind CSS showcase that consumes the [Fake Store API](https://fakestoreapi.com/) to demonstrate a full e-commerce workflow – product catalogue, product creation, shopping cart synchronisation and user management – with reusable Vue components and multilanguage support.

![Fake Store Dashboard preview](https://i.imgur.com/mIOKP43.png)

## ✨ Features

### Product experience
- **Rich catalogue UI** – hero banner, analytics cards and a responsive grid styled with Tailwind CSS.
- **Powerful filters** – combine keyword search, category filtering and sorting with URL-synchronised query parameters.
- **Product creation** – create items with live POST requests to the Fake Store API.
- **Detailed view** – dedicated product page with ratings, pricing and quick add-to-cart.

### Shopping cart
- **API synchronised cart** – login with the demo credentials to load and persist carts through the Fake Store API.
- **Quantity management** – increment, decrement and remove line items with instant totals.
- **Order summary** – responsive sidebar summarising items and totals.

### User management
- **User directory** – browse Fake Store API users with contact details and address information.
- **Search** – filter users by name, username or email.

### Internationalisation & UI system
- **Dual language support** – Traditional Chinese and English locales powered by `@nuxtjs/i18n`.
- **Composable UI library** – base button, card, input, select, textarea, badge, alert and section heading components for rapid reuse.
- **Responsive layout** – sticky header, backdrop blur, Tailwind design tokens and utility classes across the app.

## 🧱 Tech stack
- [Nuxt 4](https://nuxt.com/) with the latest Nitro runtime.
- [Tailwind CSS](https://tailwindcss.com/) via `@nuxtjs/tailwindcss` and the `@tailwindcss/forms` plugin.
- [Pinia](https://pinia.vuejs.org/) stores for products, cart, authentication and users.
- [@nuxtjs/i18n](https://i18n.nuxtjs.org/) for localisation.
- TypeScript across components, stores and composables.

## 🚀 Getting started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

Fake Store API provides public demo credentials. The login form is pre-filled with the official example account:

```
username: mor_2314
password: 83r5^_
```

## 📁 Project structure

```
.
├─ app.vue                  # Application shell with header, footer and page container
├─ assets/css/tailwind.css  # Tailwind layers and base tokens
├─ components/
│  ├─ auth/                 # Login form UI
│  ├─ cart/                 # Cart list and summary components
│  ├─ layout/               # Header, footer and language switcher
│  ├─ products/             # Product hero, grid, filters and detail components
│  ├─ ui/                   # Base UI building blocks (button, input, card, alert...)
│  └─ users/                # User card and listing components
├─ i18n/locales/            # zh & en translation files
├─ pages/                   # Nuxt routes (catalogue, product detail, cart, login, users, create product)
├─ public/                  # Static assets (hero illustration, favicons, og images)
├─ stores/                  # Pinia stores for auth, cart, products and users
├─ tailwind.config.ts       # Tailwind configuration and design tokens
├─ types/                   # Type definitions for Fake Store API entities
└─ nuxt.config.ts           # Nuxt configuration (modules, i18n, Tailwind)
```

## 🔌 Fake Store API coverage
- `GET /products` & `GET /products/:id` – catalogue and detail views.
- `GET /products/categories` – dynamic filters and creation form options.
- `POST /products` – product creation form.
- `GET /auth/login` – user authentication and JWT retrieval.
- `GET /carts/user/:id` & `POST /carts` – cart synchronisation and persistence.
- `GET /users` – user directory listing.

## 🛠️ Development notes
- All UI pieces are separated into focused components for easy maintenance.
- Tailwind CSS is the single source of styling; no legacy CSS resets remain.
- Pinia stores expose loading and error states to keep pages declarative.
- Internationalisation strings live in `/i18n/locales` with descriptive namespaces.

Feel free to adapt the layout, extend API coverage or plug the UI components into your own projects!
