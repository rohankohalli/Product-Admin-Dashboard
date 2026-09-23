import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Eye, 
  Pencil, 
  Trash2, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  PackageX,
  Sparkles
} from 'lucide-react';
import Badge from '../common/Badge';
import { TableRowSkeleton } from '../common/Skeletons';

export default function ProductTable({
  products = [],
  isLoading = false,
  sortBy = '',
  order = 'asc',
  onSort,
  onEdit,
  onDelete,
}) {
  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />;
    }
    return order === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-zinc-900" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-zinc-900" />
    );
  };

  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return <Badge variant="danger" dot>Out of stock</Badge>;
    }
    if (stock < 10) {
      return <Badge variant="warning" dot>Low ({stock})</Badge>;
    }
    return <Badge variant="success" dot>{stock} in stock</Badge>;
  };

  return (
    <div className="hidden md:block bg-white border border-zinc-200/90 rounded-xl shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-left">
          <thead className="bg-zinc-50/80 sticky top-0 z-10 text-xs font-semibold text-zinc-600 uppercase tracking-wider select-none">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">
                <button
                  type="button"
                  onClick={() => onSort?.('title')}
                  className="group inline-flex items-center gap-1.5 font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer focus:outline-none"
                >
                  Product
                  {renderSortIcon('title')}
                </button>
              </th>
              <th scope="col" className="px-3 py-3.5">
                Category
              </th>
              <th scope="col" className="px-3 py-3.5">
                <button
                  type="button"
                  onClick={() => onSort?.('price')}
                  className="group inline-flex items-center gap-1.5 font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer focus:outline-none"
                >
                  Price
                  {renderSortIcon('price')}
                </button>
              </th>
              <th scope="col" className="px-3 py-3.5">
                <button
                  type="button"
                  onClick={() => onSort?.('rating')}
                  className="group inline-flex items-center gap-1.5 font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer focus:outline-none"
                >
                  Rating
                  {renderSortIcon('rating')}
                </button>
              </th>
              <th scope="col" className="px-3 py-3.5">
                Stock
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 bg-white text-sm">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                      <PackageX className="w-6 h-6" />
                    </div>
                    <p className="text-base font-medium text-zinc-800">
                      No products found
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Try adjusting your search query, clearing filters, or adding a new product.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const imageSrc = product.thumbnail || (product.images && product.images[0]) || 'https://placehold.co/100x100?text=No+Image';

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-zinc-50/70 transition-colors group"
                  >
                    {/* Product Column */}
                    <td className="py-3 pl-4 pr-3 sm:pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200/80 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                          <img
                            src={imageSrc}
                            alt={product.title}
                            className="w-full h-full object-contain mix-blend-multiply"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/100x100?text=Item';
                            }}
                          />
                        </div>
                        <div className="min-w-0 max-w-xs xl:max-w-md">
                          <Link
                            to={`/products/${product.id}`}
                            className="font-medium text-zinc-900 hover:text-indigo-600 transition-colors line-clamp-1 group-hover:underline decoration-zinc-300 underline-offset-2"
                            title={product.title}
                          >
                            {product.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            {product.brand && (
                              <span className="text-xs text-zinc-500 font-normal">
                                {product.brand}
                              </span>
                            )}
                            {product._isLocal && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded px-1.5 py-0.2">
                                <Sparkles className="w-2.5 h-2.5" />
                                Added Local
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <Badge variant="neutral">
                        {product.category || 'Uncategorized'}
                      </Badge>
                    </td>

                    {/* Price Column */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-baseline gap-1.5">
                        <span className="tabular-nums font-semibold text-zinc-900">
                          ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                        </span>
                        {product.discountPercentage > 0 && (
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1 rounded">
                            -{Math.round(product.discountPercentage)}%
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Rating Column */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50/80 border border-amber-200/60 text-amber-900 text-xs font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="tabular-nums">
                          {typeof product.rating === 'number' ? product.rating.toFixed(2) : product.rating || 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Stock Column */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      {getStockBadge(product.stock)}
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 pl-3 pr-4 sm:pr-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1">
                        <Link
                          to={`/products/${product.id}`}
                          className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                          title="View Details"
                          aria-label={`View details for ${product.title}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onEdit?.(product)}
                          className="p-1.5 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                          title="Edit Product"
                          aria-label={`Edit ${product.title}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(product)}
                          className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Product"
                          aria-label={`Delete ${product.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
