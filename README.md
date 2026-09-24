# Product Admin Dashboard 🛍️

A high-performance, handcrafted Admin Dashboard built with **React**, **JavaScript**, **Tailwind CSS**, and **Axios**, powered by the [DummyJSON API](https://dummyjson.com).

Designed with a clean, tactile light theme, micro-interactions, responsive desktop/mobile views, URL query persistence, and zero external table/pagination libraries.

---

## 🚀 Live Demo & Repository
- **Live Deployment:** [Deployed on Vercel / Netlify](https://your-deployment-link.vercel.app) *(Replace with your live URL)*
- **GitHub Repository:** [Product-Admin-Dashboard](https://github.com/rohankohalli/Product-Admin-Dashboard)

---

## 🛠️ Tech Stack
- **Framework & Runtime:** React 19 (JavaScript), Vite 8
- **Styling & Design System:** Tailwind CSS v4 (Light theme, custom slate/zinc porcelain palette, tabular numbers)
- **HTTP Client:** Axios (Centralized instance, JWT bearer request interceptor, centralized response error interceptor)
- **Routing:** React Router v7 (Protected routes, dynamic params, HTML5 history URL search synchronization)
- **Icons:** Lucide React
- **Dependencies Rule:** Zero external table, query, or pagination libraries (built completely from scratch).

---

## ✨ Features Completed

### 1. Authentication & Route Protection
- **Login Page (`/login`):**
  - Authenticates against DummyJSON `POST /auth/login`.
  - Credentials: `username: emilys` / `password: emilyspass`.
  - 1-click **"Fill Demo"** button for instant evaluation.
  - Comprehensive error alerts for invalid credentials.
  - Double-click prevention (`isSubmitting` lock with spinner).
- **Route Guard (`ProtectedRoute`):**
  - Restricts `/products` and `/products/:id` to logged-in users.
  - Redirects unauthenticated users to `/login` while remembering their destination (`state: { from }`).
  - Auto-redirects authenticated users visiting `/login` back to `/products`.
  - Header profile display with avatar, user metadata, and accessible **Logout** action.

### 2. Product Catalog (Desktop Table & Mobile Cards)
- **Desktop Table View:**
  - Sticky header with sort indicators.
  - Columns: Image preview, Product Title (with brand & local badge), Category pill, Price (with discount tag), Rating (star score), Stock level badge, Actions.
  - Stock badges:
    - 🟢 `In stock` (>= 10 units)
    - 🟡 `Low stock (X)` (1–9 units)
    - 🔴 `Out of stock` (0 units)
- **Mobile Card Grid View (`< 768px`):**
  - Responsive 1-to-2 column card layout with touch-friendly 44px tap targets.
  - High-res product thumbnail, stock pills, price, rating, and action buttons.

### 3. Custom Zero-Dependency Pagination
- Custom math implementation using `limit` and `skip` (`skip = (page - 1) * limit`).
- Informative summary: `"Showing 21–40 of 194"`.
- Page size options: `10`, `20`, `50` per page.
- Smart windowed page pills with ellipsis (`1, 2, 3 ... 10`) and disabled state boundaries for Previous/Next buttons.

### 4. Debounced Search & Race-Condition Safe Ingestion
- Custom `useDebounce` hook (400ms delay) to prevent excessive API requests.
- Typing immediately resets pagination to page 1.
- **Race Condition Prevention:** Utilizes `AbortController` on Axios requests and sequential `requestId` checking. Even with simulated network lag (`&delay=2000`), older in-flight search responses are safely aborted and cannot overwrite newer search results.

### 5. Category Filtering & Sorting
- Dynamic category list loaded from `/products/categories`.
- Sort by **Price**, **Rating**, or **Title** with toggleable **Ascending / Descending** directions.
- One-click **Reset Filters** button.

### 6. Product Details (`/products/:id`)
- Deep-dive product showcase featuring:
  - Interactive multi-image gallery with clickable thumbnail strip.
  - Specs grid: SKU, Weight, Dimensions, Availability status.
  - Logistics badges: Warranty details, Shipping information, Return policy.
  - Customer Reviews feed with reviewer name, star rating, date, and comments.
- **Custom 404 Screen:** If an invalid ID (e.g. `/products/abc` or `/products/999999`) or a deleted item is accessed, a dedicated "Product Not Found" screen renders with a button back to catalog.

### 7. Full CRUD (Add, Edit, Delete)
- **Product Modal Form:**
  - Real-time and submit-time validation for Title (min 2 chars), Category (required), Price (> 0), Stock (whole integer >= 0), and Description (min 5 chars).
  - Double-click submission protection.
- **Delete Confirmation Dialog:**
  - Accessible modal with danger styling displaying the product title before confirming irreversible deletion.

### 8. Loading, Empty, and Error States
- **Loading:** Subtle skeleton table rows and skeleton card placeholders.
- **Empty State:** Friendly illustration with helpful reset prompt when 0 products match filters.
- **Error State:** Dedicated error banner with an interactive **Retry** button.

### 9. URL State Synchronization & Resilience
- All filters (`page`, `limit`, `q`, `category`, `sortBy`, `order`) are stored in `window.location.search`.
- Refreshing the browser or sharing a URL preserves the exact dashboard view.
- **Sanitization:** Malformed parameters like `?page=abc`, `?page=-10`, or `?limit=9999` are automatically sanitized to safe defaults (`page=1`, `limit=10`) without crashing.

---

## 🧠 Architectural Decisions & Problem Solving

### 1. The Blocker: The "Phantom 404" & Ephemeral Mutations
- **The Problem:** DummyJSON is a mock API. When calling `POST /products/add`, it responds with a success status and an ID like `195`, but **never persists the record on their backend**. When clicking "View Details" to open `/products/195`, DummyJSON immediately responds with HTTP 404! Furthermore, editing or deleting products was immediately lost on page reload or pagination changes.
- **The Solution:** We architected a **Persistent Client-Side Mutation Cache** (`ProductStoreContext`) backed by `localStorage`:
  1. **Additions:** New products are stored locally with an indicator (`_isLocal: true`) and prepended to the catalog.
  2. **Interception:** When visiting `/products/:id`, the store first checks local creations and updates. If found locally, it resolves instantly, preventing the dead API 404.
  3. **Deletions:** Deleted product IDs are stored in a local tombstone registry, filtering them out of lists and correctly serving a 404 if accessed directly.
  4. Changes persist across browser refreshes and pagination switches.

### 2. The Conflict: Search vs. Category Mutual Exclusivity
- **The Problem:** DummyJSON's backend cannot search and filter by category simultaneously. Passing `category` to `/products/search?q=` is ignored; passing `q` to `/products/category/` is also ignored.
- **The Solution:** We implemented a **Hybrid Data Fetcher**:
  - When both a category and a search query are applied, the app queries the category endpoint and performs an immediate, case-insensitive client-side filter across `title`, `brand`, and `description`.
  - The UI presents a subtle status indicator: *"Searching for '{query}' inside '{category}' (client-side filtered)"* to keep the user informed.

### 3. Where AI Helped Me
- **Brainstorming Architecture:** Assisted in mapping out how to handle DummyJSON's mock persistence gracefully so newly created products wouldn't break on detail pages.
- **Tailwind Palette & Aesthetics:** Suggested warm neutral tones (`#f8fafc`, slate-900, stone borders) to achieve a handcrafted, human light theme.
- **Edge-Case Validation:** Assisted in identifying query parameter edge cases (like negative page numbers and string limits) to ensure the URL parser never crashes.

---

## 🏃 Getting Started Locally

### Prerequisites
- Node.js `v18+` (tested on Node `v24.21.0`)
- npm `v9+`

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rohankohalli/Product-Admin-Dashboard.git
   cd Product-Admin-Dashboard/Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Verify linting and production build:**
   ```bash
   npm run lint   # 0 errors, 0 warnings
   npm run build  # Creates optimized production build in dist/
   ```

---

## 🔐 Demo Login Credentials
- **Username:** `emilys`
- **Password:** `emilyspass`
*(Or click the "Fill Demo" button on `/login`)*