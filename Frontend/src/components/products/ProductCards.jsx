import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, Pencil, Trash2, PackageX, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';
import { CardSkeleton } from '../common/Skeletons';

export default function ProductCards({
  products = [],
  isLoading = false,
  onEdit,
  onDelete,
}) {
  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return <Badge variant="danger" dot>Out of stock</Badge>;
    }
    if (stock < 10) {
      return <Badge variant="warning" dot>Low ({stock})</Badge>;
    }
    return <Badge variant="success" dot>{stock} in stock</Badge>;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="md:hidden bg-white border border-zinc-200/90 rounded-xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-3">
          <PackageX className="w-6 h-6" />
        </div>
        <p className="text-base font-medium text-zinc-800">No products found</p>
        <p className="text-xs text-zinc-500 mt-1">
          Try adjusting your search query, clearing filters, or adding a new product.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
      {products.map((product) => {
        const imageSrc =
          product.thumbnail ||
          (product.images && product.images[0]) ||
          'https://placehold.co/300x200?text=No+Image';

        return (
          <div
            key={product.id}
            className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-zinc-300 transition-colors"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative aspect-4/3 w-full bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100 flex items-center justify-center p-3 mb-3">
                <img
                  src={imageSrc}
                  alt={product.title}
                  className="w-full h-full object-contain mix-blend-multiply"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/300x200?text=Item';
                  }}
                />
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  <Badge variant="neutral" size="sm">
                    {product.category || 'General'}
                  </Badge>
                  {product._isLocal && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded px-1.5 py-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      Local
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  {getStockBadge(product.stock)}
                </div>
              </div>

              {/* Title & Brand */}
              <div>
                <Link
                  to={`/products/${product.id}`}
                  className="font-medium text-zinc-900 hover:text-indigo-600 transition-colors line-clamp-1 text-base"
                >
                  {product.title}
                </Link>
                {product.brand && (
                  <p className="text-xs text-zinc-500 mt-0.5">by {product.brand}</p>
                )}
              </div>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
                <div className="flex items-baseline gap-1.5">
                  <span className="tabular-nums font-semibold text-base text-zinc-900">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1 rounded">
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  )}
                </div>

                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50/80 border border-amber-200/60 text-amber-900 text-xs font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="tabular-nums">
                    {typeof product.rating === 'number' ? product.rating.toFixed(2) : product.rating || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Touch-Friendly Action Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-zinc-100">
              <Link
                to={`/products/${product.id}`}
                className="inline-flex items-center justify-center gap-1 py-2 px-2 text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-lg transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                View
              </Link>
              <button
                type="button"
                onClick={() => onEdit?.(product)}
                className="inline-flex items-center justify-center gap-1 py-2 px-2 text-xs font-medium text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100/60 border border-indigo-200/60 rounded-lg transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(product)}
                className="inline-flex items-center justify-center gap-1 py-2 px-2 text-xs font-medium text-rose-700 bg-rose-50/60 hover:bg-rose-100/60 border border-rose-200/60 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
