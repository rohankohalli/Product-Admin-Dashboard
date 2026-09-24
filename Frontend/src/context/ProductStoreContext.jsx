/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import * as productService from '../api/productService';

const ProductStoreContext = createContext(null);

const STORAGE_KEYS = {
  CREATED: 'apexstore_local_created',
  UPDATED: 'apexstore_local_updated',
  DELETED: 'apexstore_local_deleted',
};

export function ProductStoreProvider({ children }) {
  // Local persistence states
  const [localCreated, setLocalCreated] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CREATED);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [localUpdated, setLocalUpdated] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.UPDATED);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [localDeleted, setLocalDeleted] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DELETED);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever local states update
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CREATED, JSON.stringify(localCreated));
  }, [localCreated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UPDATED, JSON.stringify(localUpdated));
  }, [localUpdated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DELETED, JSON.stringify(localDeleted));
  }, [localDeleted]);

  // Request race condition prevention references
  const abortControllerRef = useRef(null);
  const latestRequestIdRef = useRef(0);

  /**
   * Helper: Merges local edits & filters out local deletions for an array of products
   */
  const applyLocalOverrides = useCallback((items) => {
    return items
      .filter((item) => !localDeleted.includes(Number(item.id)) && !localDeleted.includes(String(item.id)))
      .map((item) => {
        const idKey = String(item.id);
        if (localUpdated[idKey]) {
          return { ...item, ...localUpdated[idKey] };
        }
        return item;
      });
  }, [localDeleted, localUpdated]);

  /**
   * Main Data Fetcher with:
   * 1. Cancellation of stale in-flight requests (AbortController)
   * 2. Sequential requestId validation (race condition prevention)
   * 3. DummyJSON Search vs Category limitation resolution (hybrid client filtering)
   * 4. Integration of local additions, edits, and deletions
   */
  const getProductsList = useCallback(async ({
    page = 1,
    limit = 10,
    q = '',
    category = '',
    sortBy = '',
    order = 'asc',
  } = {}) => {
    // 1. Cancel previous in-flight request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 2. Increment request ID sequence
    const currentRequestId = ++latestRequestIdRef.current;

    const skip = (page - 1) * limit;

    try {
      let apiProducts = [];
      let totalCount = 0;

      // Case A: User has both Category filter AND Search query active
      // DummyJSON API cannot combine both; so we fetch the category set and client-side filter by search query
      if (q && category) {
        const data = await productService.fetchByCategory({
          category,
          limit: 100, // retrieve category items to allow accurate client matching
          sortBy,
          order,
          signal: controller.signal,
        });

        // Check if a newer request was dispatched while waiting
        if (currentRequestId !== latestRequestIdRef.current) return { products: [], total: 0 };

        // Include locally created products that match this category
        const matchingLocalCreated = localCreated.filter(
          (p) => p.category?.toLowerCase() === category.toLowerCase()
        );

        const combined = [...matchingLocalCreated, ...(data.products || [])];
        const withOverrides = applyLocalOverrides(combined);

        // Apply case-insensitive query matching on title, brand, description
        const lowerQ = q.toLowerCase();
        const searchFiltered = withOverrides.filter((p) =>
          p.title?.toLowerCase().includes(lowerQ) ||
          p.brand?.toLowerCase().includes(lowerQ) ||
          p.description?.toLowerCase().includes(lowerQ)
        );

        totalCount = searchFiltered.length;
        apiProducts = searchFiltered.slice(skip, skip + limit);
      }
      // Case B: Search query only
      else if (q) {
        const data = await productService.searchProducts({
          q,
          limit,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });

        if (currentRequestId !== latestRequestIdRef.current) return { products: [], total: 0 };

        // Check if any locally created products match the search query
        const lowerQ = q.toLowerCase();
        const matchingLocalCreated = localCreated.filter((p) =>
          p.title?.toLowerCase().includes(lowerQ) ||
          p.brand?.toLowerCase().includes(lowerQ) ||
          p.description?.toLowerCase().includes(lowerQ)
        );

        const combined = [...matchingLocalCreated, ...(data.products || [])];
        const withOverrides = applyLocalOverrides(combined);

        // Calculate total considering local creations and tombstones
        totalCount = (data.total || 0) + matchingLocalCreated.length - localDeleted.filter(id => data.products?.some(p => p.id === id)).length;
        apiProducts = withOverrides.slice(0, limit);
      }
      // Case C: Category filter only
      else if (category) {
        const data = await productService.fetchByCategory({
          category,
          limit,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });

        if (currentRequestId !== latestRequestIdRef.current) return { products: [], total: 0 };

        const matchingLocalCreated = localCreated.filter(
          (p) => p.category?.toLowerCase() === category.toLowerCase()
        );

        const combined = [...matchingLocalCreated, ...(data.products || [])];
        const withOverrides = applyLocalOverrides(combined);

        totalCount = (data.total || 0) + matchingLocalCreated.length;
        apiProducts = withOverrides.slice(0, limit);
      }
      // Case D: Default all products
      else {
        const data = await productService.fetchProducts({
          limit,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });

        if (currentRequestId !== latestRequestIdRef.current) return { products: [], total: 0 };

        // Prepend locally created products on page 1
        const combined = page === 1 ? [...localCreated, ...(data.products || [])] : (data.products || []);
        const withOverrides = applyLocalOverrides(combined);

        totalCount = (data.total || 0) + localCreated.length - localDeleted.length;
        apiProducts = withOverrides.slice(0, limit);
      }

      return {
        products: apiProducts,
        total: Math.max(0, totalCount),
      };
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        // Ignored aborted requests
        return { products: [], total: 0, isCanceled: true };
      }
      throw err;
    }
  }, [localCreated, localDeleted, applyLocalOverrides]);

  /**
   * Fetch Single Product with Local Interception:
   * Prevents "Phantom 404" for locally added products
   */
  const getProductById = useCallback(async (id) => {
    const numId = Number(id);

    // 1. If it was deleted locally, treat as 404 immediately
    if (localDeleted.includes(numId) || localDeleted.includes(String(id))) {
      const err = new Error('Product not found (deleted locally)');
      err.response = { status: 404 };
      throw err;
    }

    // 2. If it's a locally created product, resolve directly from store without hitting API
    const foundLocal = localCreated.find((p) => String(p.id) === String(id));
    if (foundLocal) {
      const idKey = String(id);
      return localUpdated[idKey] ? { ...foundLocal, ...localUpdated[idKey] } : foundLocal;
    }

    // 3. Otherwise fetch from DummyJSON API and merge any local updates
    const data = await productService.fetchProductById(id);
    const idKey = String(id);
    return localUpdated[idKey] ? { ...data, ...localUpdated[idKey] } : data;
  }, [localCreated, localUpdated, localDeleted]);

  /**
   * Create Product:
   * Triggers API POST and persists in local store
   */
  const createProduct = async (formData) => {
    let apiResponse = null;
    try {
      apiResponse = await productService.createProduct(formData);
    } catch (err) {
      console.warn('API POST /products/add mock failed or network issue, using local fallback:', err);
    }

    const newId = apiResponse?.id || Date.now();
    const newProduct = {
      ...formData,
      id: newId,
      _isLocal: true,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviews: [
        {
          rating: 5,
          comment: 'Newly added catalog inventory item.',
          date: new Date().toISOString(),
          reviewerName: 'Store Administrator',
          reviewerEmail: 'admin@apexstore.internal',
        },
      ],
    };

    setLocalCreated((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  /**
   * Update Product:
   * Triggers API PUT and stores updated field delta
   */
  const updateProduct = async (id, formData) => {
    try {
      await productService.updateProduct(id, formData);
    } catch (err) {
      console.warn('API PUT /products/:id mock failed, applying local update anyway:', err);
    }

    // If it's in localCreated, update it in place
    setLocalCreated((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, ...formData } : p))
    );

    // Also record in localUpdated map
    setLocalUpdated((prev) => ({
      ...prev,
      [String(id)]: {
        ...(prev[String(id)] || {}),
        ...formData,
      },
    }));
  };

  /**
   * Delete Product:
   * Triggers API DELETE and marks ID in tombstone list
   */
  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
    } catch (err) {
      console.warn('API DELETE /products/:id mock failed, applying local deletion anyway:', err);
    }

    setLocalDeleted((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setLocalCreated((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  return (
    <ProductStoreContext.Provider
      value={{
        getProductsList,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        fetchCategories: productService.fetchCategories,
      }}
    >
      {children}
    </ProductStoreContext.Provider>
  );
}

export function useProductStore() {
  const context = useContext(ProductStoreContext);
  if (!context) {
    throw new Error('useProductStore must be used within a ProductStoreProvider');
  }
  return context;
}
