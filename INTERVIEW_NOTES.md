# Interview Walkthrough & Live-Coding Cheat Sheet 🎯

This document is your quick reference guide for the live walkthrough and live coding evaluation.

---

## 1. 2-Minute Architecture Walkthrough (How to explain your code)

1. **Tech Stack & Philosophy:**
   - *"I built this using React 19, JavaScript, Tailwind CSS v4, and Axios."*
   - *"I strictly avoided React Query, SWR, or table libraries to write all custom state, pagination, and debounce logic myself as required."*

2. **Core Structure (Take them through this flow):**
   - **`src/api/axiosInstance.js`**: Shared Axios instance with base URL `https://dummyjson.com`. Has a request interceptor that injects the auth token, and a response interceptor that catches 401 Unauthorized errors and standardizes error messages.
   - **`src/context/AuthContext.jsx`**: Manages user login state, stores credentials in `localStorage`, and handles signout.
   - **`src/components/layout/ProtectedRoute.jsx`**: Protects `/products` and `/products/:id`, redirecting unauthenticated users to `/login`.
   - **`src/context/ProductStoreContext.jsx`**: The heart of the data layer. It manages data fetching, integrates `AbortController` to cancel in-flight search requests, handles the DummyJSON search/category limitation, and provides local persistence for added/edited/deleted products so newly created items don't throw 404s.
   - **`src/hooks/useQueryParams.js`**: Keeps `page`, `limit`, `q`, `category`, `sortBy`, and `order` synchronized in the URL so refreshes and shared links work seamlessly, while sanitizing edge cases like `?page=abc`.
   - **`src/pages/ProductsPage.jsx`**: The dashboard view that orchestrates the desktop `ProductTable`, mobile `ProductCards`, `Pagination`, and CRUD modals.

---

## 2. Answers to "Things to Handle Carefully"

### Q: "How did you prevent old search results from replacing new ones when typing fast?"
> **Answer:**
> *"I implemented a dual-layer guard in `ProductStoreContext.jsx`:*
> 1. *Before firing a new search request, I invoke `abortControllerRef.current.abort()`, which immediately cancels the pending Axios HTTP socket at the browser level.*
> 2. *I also maintain a monotonic `latestRequestIdRef` sequence counter. When an API response resolves, I verify `if (currentRequestId !== latestRequestIdRef.current) return;`. Even if network delay causes an older request to finish late (testable with `&delay=2000`), it is safely discarded before touching React state."*

### Q: "DummyJSON cannot search and filter by category at the same time. What does your app do and why?"
> **Answer:**
> *"DummyJSON's backend silently drops one parameter if you send both (sending `category` to search is ignored, and sending `q` to category returns everything in that category).*
> *Rather than disabling one control or letting search fail silently, I built a hybrid fetcher: when both are active, the app queries the category endpoint and applies client-side case-insensitive substring matching on `title`, `brand`, and `description`. A subtle status pill informs the user that results are refined within that category."*

### Q: "Add, edit, and delete are not saved by DummyJSON. How did you handle this?"
> **Answer:**
> *"When calling `POST /products/add`, DummyJSON returns an ID like 195, but never saves it to their database. If you click 'View Details' on that new product, DummyJSON returns a 404 Not Found!*
> *To fix this, I built a persistent local cache in `ProductStoreContext` synced with `localStorage`. Newly added products are kept locally and prepended to the list; when accessing `/products/:id`, the app checks the local store first before hitting the API, completely preventing the 404 bug. Edits and deletions are tracked and merged on top of API responses across page reloads."*

### Q: "How did you handle wrong URL values like ?page=abc or ?page=999?"
> **Answer:**
> *"In `src/hooks/useQueryParams.js`, every URL parameter is parsed defensively. `parseInt(rawPage, 10)` falls back to 1 if `isNaN` or `< 1`. The `limit` parameter is clamped to allowed options (`[10, 20, 50]`). The page will never crash from invalid or malicious URL parameters."*

### Q: "How did you prevent multiple clicks on Save or Login?"
> **Answer:**
> *"Both forms track an `isSubmitting` state. While the async request is pending, the submit button is disabled and displays an inline spinner, locking user interaction and preventing duplicate network requests."*

---

## 3. Likely Live Coding Tasks (How to solve them fast)

### Task A: "Change the debounce delay from 400ms to 800ms"
- **File:** `src/pages/ProductsPage.jsx`
- **Line ~34:** Change `useDebounce(searchInput, 400)` to `useDebounce(searchInput, 800)`.

### Task B: "Add a new page size option (e.g. 5 or 25)"
- **File 1:** `src/hooks/useQueryParams.js` -> add `5` or `25` to `ALLOWED_LIMITS = [5, 10, 20, 25, 50];`
- **File 2:** `src/pages/ProductsPage.jsx` -> add to `pageSizeOptions={[5, 10, 20, 25, 50]}`.

### Task C: "Add a new column to the table (e.g. Brand)"
- **File:** `src/components/products/ProductTable.jsx`
  1. Add `<th>Brand</th>` in the `<thead>`.
  2. Add `<td className="px-3 py-3 text-zinc-600">{product.brand || 'N/A'}</td>` in the `<tbody>`.

### Task D: "Add validation that price must be at least $1.00"
- **File:** `src/components/products/ProductFormModal.jsx`
  In `validate()` function: change `priceNum <= 0` to `priceNum < 1.0` and update message to `'Price must be at least $1.00'`.
