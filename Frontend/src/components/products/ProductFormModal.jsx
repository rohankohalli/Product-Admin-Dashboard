import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product = null, // null for Add, existing product object for Edit
  categories = [],
  isSubmitting = false,
}) {
  const isEditing = Boolean(product && product.id);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    stock: '',
    brand: '',
    description: '',
    thumbnail: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reset or populate form whenever modal opens or active product changes
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          title: product.title || '',
          category: product.category || '',
          price: product.price !== undefined ? String(product.price) : '',
          stock: product.stock !== undefined ? String(product.stock) : '',
          brand: product.brand || '',
          description: product.description || '',
          thumbnail: product.thumbnail || (product.images && product.images[0]) || '',
        });
      } else {
        setFormData({
          title: '',
          category: categories[0]?.slug || (typeof categories[0] === 'string' ? categories[0] : ''),
          price: '',
          stock: '10',
          brand: '',
          description: '',
          thumbnail: '',
        });
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, product, categories]);

  const validate = (data) => {
    const errs = {};
    if (!data.title || !data.title.trim()) {
      errs.title = 'Product title is required';
    } else if (data.title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters';
    }

    if (!data.category || !data.category.trim()) {
      errs.category = 'Category is required';
    }

    const priceNum = parseFloat(data.price);
    if (data.price === '' || isNaN(priceNum) || priceNum <= 0) {
      errs.price = 'Price must be a valid positive number';
    }

    const stockNum = parseInt(data.stock, 10);
    if (data.stock === '' || isNaN(stockNum) || stockNum < 0) {
      errs.stock = 'Stock must be a non-negative whole integer';
    }

    if (!data.description || !data.description.trim()) {
      errs.description = 'Description is required';
    } else if (data.description.trim().length < 5) {
      errs.description = 'Description must be at least 5 characters long';
    }

    return errs;
  };

  const handleChange = (field, value) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);

    if (touched[field]) {
      const fieldErrors = validate(nextData);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrors[field],
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      thumbnail: formData.thumbnail.trim() || 'https://placehold.co/400x400?text=Product',
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Product' : 'Add New Product'}
      description={
        isEditing
          ? 'Update the product specifications and inventory levels.'
          : 'Create a new product listing in your catalog.'
      }
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
            Product Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            placeholder="e.g. Ergonomic Wooden Desk"
            className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.title && touched.title
                ? 'border-rose-400 focus:ring-rose-500/10 focus:border-rose-500'
                : 'border-zinc-200 focus:ring-zinc-900/10 focus:border-zinc-500'
            }`}
          />
          {errors.title && touched.title && (
            <p className="text-xs text-rose-600 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Category & Brand row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.category && touched.category
                  ? 'border-rose-400 focus:ring-rose-500/10 focus:border-rose-500'
                  : 'border-zinc-200 focus:ring-zinc-900/10 focus:border-zinc-500'
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => {
                const slug = typeof cat === 'object' ? cat.slug : cat;
                const name = typeof cat === 'object' ? cat.name : cat;
                return (
                  <option key={slug} value={slug}>
                    {name}
                  </option>
                );
              })}
            </select>
            {errors.category && touched.category && (
              <p className="text-xs text-rose-600 mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Brand (Optional)
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              placeholder="e.g. Apple, Nike, Sony"
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-500 transition-all"
            />
          </div>
        </div>

        {/* Price & Stock row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Price (USD $) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              onBlur={() => handleBlur('price')}
              placeholder="0.00"
              className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 tabular-nums transition-all ${
                errors.price && touched.price
                  ? 'border-rose-400 focus:ring-rose-500/10 focus:border-rose-500'
                  : 'border-zinc-200 focus:ring-zinc-900/10 focus:border-zinc-500'
              }`}
            />
            {errors.price && touched.price && (
              <p className="text-xs text-rose-600 mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Stock Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              onBlur={() => handleBlur('stock')}
              placeholder="0"
              className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 tabular-nums transition-all ${
                errors.stock && touched.stock
                  ? 'border-rose-400 focus:ring-rose-500/10 focus:border-rose-500'
                  : 'border-zinc-200 focus:ring-zinc-900/10 focus:border-zinc-500'
              }`}
            />
            {errors.stock && touched.stock && (
              <p className="text-xs text-rose-600 mt-1">{errors.stock}</p>
            )}
          </div>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
            Image URL (Optional)
          </label>
          <input
            type="url"
            value={formData.thumbnail}
            onChange={(e) => handleChange('thumbnail', e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-500 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder="Describe product features, specs, and details..."
            className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.description && touched.description
                ? 'border-rose-400 focus:ring-rose-500/10 focus:border-rose-500'
                : 'border-zinc-200 focus:ring-zinc-900/10 focus:border-zinc-500'
            }`}
          />
          {errors.description && touched.description && (
            <p className="text-xs text-rose-600 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
