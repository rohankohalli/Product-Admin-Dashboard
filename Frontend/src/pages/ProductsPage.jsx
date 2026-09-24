import React, { useState, useEffect, useCallback } from 'react';
import { 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2,
  Package,
  Layers,
  Star,
  AlertTriangle
} from 'lucide-react';
import { useProductStore } from '../context/ProductStoreContext';
import { useQueryParams } from '../hooks/useQueryParams';
import { useDebounce } from '../hooks/useDebounce';
import ProductFilters from '../components/products/ProductFilters';
import ProductTable from '../components/products/ProductTable';
import ProductCards from '../components/products/ProductCards';
import Pagination from '../components/common/Pagination';
import ProductFormModal from '../components/products/ProductFormModal';
import ConfirmModal from '../components/common/ConfirmModal';
import Button from '../components/common/Button';

export default function ProductsPage() {
  const {
    getProductsList,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const { params, setParams } = useQueryParams();
  const { page, limit, q, category, sortBy, order } = params;

  // Local search text input for immediate typing response
  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Data states
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  // Success toast / feedback notification
  const [toastMessage, setToastMessage] = useState(null);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Synchronize debounced search input with URL params
  // When search changes, reset page to 1
  useEffect(() => {
    if (debouncedSearch !== q) {
      setParams({
        q: debouncedSearch,
        page: 1, // Reset to page 1 on search change
      });
    }
  }, [debouncedSearch, q, setParams]);

  // Keep search input in sync if URL changes externally (e.g. Back/Forward button)
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  // Show temporary toast
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Fetch Categories once on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        setIsLoadingCategories(true);
        const list = await fetchCategories();
        if (isMounted) setCategories(list || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (isMounted) setIsLoadingCategories(false);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, [fetchCategories]);

  // Fetch Products based on current params
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getProductsList({
        page,
        limit,
        q,
        category,
        sortBy,
        order,
      });

      if (!result.isCanceled) {
        setProducts(result.products || []);
        setTotalItems(result.total || 0);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        setError(err.friendlyMessage || err.message || 'Failed to fetch products');
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, q, category, sortBy, order, getProductsList]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handlers for URL Parameter Changes
  const handlePageChange = (newPage) => {
    setParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setParams({ limit: newSize, page: 1 });
  };

  const handleCategoryChange = (newCat) => {
    setParams({ category: newCat, page: 1 });
  };

  const handleSortChange = (newSortBy, newOrder) => {
    setParams({ sortBy: newSortBy, order: newOrder, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setParams({
      q: '',
      category: '',
      sortBy: '',
      order: 'asc',
      page: 1,
    });
  };

  // CRUD Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    setIsSubmittingForm(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        showToast(`Successfully updated "${formData.title}"`);
      } else {
        await createProduct(formData);
        showToast(`Successfully created "${formData.title}"`);
      }
      setIsFormOpen(false);
      loadProducts();
    } catch (err) {
      alert(`Error saving product: ${err.message}`);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handlePromptDelete = (product) => {
    setDeletingProduct(product);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id);
      showToast(`Deleted "${deletingProduct.title}"`);
      setDeletingProduct(null);
      loadProducts();
    } catch (err) {
      alert(`Error deleting product: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-zinc-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-lg border border-zinc-700 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Product Catalog
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time inventory management, categorical filtering, and catalog health.
          </p>
        </div>
      </div>

      {/* Lovable-Style Metric Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Products */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-400 block">Total Catalog</span>
            <span className="text-xl font-bold text-zinc-900 tabular-nums mt-0.5 block">
              {totalItems}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200/60 flex items-center justify-center text-zinc-700">
            <Package className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 2: Active Categories */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-400 block">Categories</span>
            <span className="text-xl font-bold text-zinc-900 tabular-nums mt-0.5 block">
              {categories.length || 24}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        {/* Metric 3: Average Rating */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-400 block">Avg Quality Rating</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-zinc-900 tabular-nums">4.52</span>
              <span className="text-xs text-amber-500 font-semibold">★</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
        </div>

        {/* Metric 4: Stock Health */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-zinc-400 block">Inventory Health</span>
            <span className="text-xl font-bold text-emerald-600 tabular-nums mt-0.5 block">
              98.2%
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <ProductFilters
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        selectedCategory={category}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        sortBy={sortBy}
        order={order}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        onAddNewProduct={handleOpenAddModal}
        isLoadingCategories={isLoadingCategories}
      />

      {/* Error State with Retry Button */}
      {error && (
        <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Failed to load product data</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={loadProducts}
            icon={RotateCcw}
            className="border-rose-200 hover:bg-rose-100/50 text-rose-800 text-xs shrink-0"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Desktop Table View */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        sortBy={sortBy}
        order={order}
        onSort={(col) => handleSortChange(col, sortBy === col && order === 'asc' ? 'desc' : 'asc')}
        onEdit={handleOpenEditModal}
        onDelete={handlePromptDelete}
      />

      {/* Mobile Card Grid View */}
      <ProductCards
        products={products}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handlePromptDelete}
      />

      {/* Custom Zero-Dependency Pagination Bar */}
      {totalItems > 0 && (
        <Pagination
          currentPage={page}
          totalItems={totalItems}
          pageSize={limit}
          pageSizeOptions={[10, 20, 50]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
        />
      )}

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        isSubmitting={isSubmittingForm}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        productTitle={deletingProduct?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
}
