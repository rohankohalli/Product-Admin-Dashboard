import React from 'react';
import { 
  Search, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import Button from '../common/Button';

export default function ProductFilters({
  searchQuery = '',
  onSearchChange,
  selectedCategory = '',
  onCategoryChange,
  categories = [],
  sortBy = '',
  order = 'asc',
  onSortChange,
  onResetFilters,
  onAddNewProduct,
  isLoadingCategories = false,
}) {
  const isFiltered = Boolean(searchQuery || selectedCategory || sortBy);

  const sortOptions = [
    { value: '', label: 'Default Sorting' },
    { value: 'title', label: 'Title (Alphabetical)' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Top Bar: Search, Category, Sorting, and Add Product */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, brand, or keyword..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-500 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Controls: Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={isLoadingCategories}
              className="text-sm font-medium bg-white text-zinc-800 border border-zinc-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-500 cursor-pointer shadow-2xs appearance-none disabled:opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em',
              }}
            >
              <option value="">All Categories</option>
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
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value, order)}
              className="text-sm font-medium bg-white text-zinc-800 border border-zinc-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-500 cursor-pointer shadow-2xs appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em',
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Direction Toggle (Asc / Desc) */}
          {sortBy && (
            <button
              type="button"
              onClick={() => onSortChange?.(sortBy, order === 'asc' ? 'desc' : 'asc')}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 cursor-pointer shadow-2xs"
              title={`Switch to ${order === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {order === 'asc' ? (
                <>
                  <ArrowUp className="w-3.5 h-3.5 text-zinc-800" />
                  <span>Asc</span>
                </>
              ) : (
                <>
                  <ArrowDown className="w-3.5 h-3.5 text-zinc-800" />
                  <span>Desc</span>
                </>
              )}
            </button>
          )}

          {/* Reset Filters Button */}
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              icon={RotateCcw}
              className="text-zinc-500 hover:text-zinc-900 text-xs"
              title="Reset all search & filter criteria"
            >
              Reset
            </Button>
          )}

          {/* Add Product Button */}
          <Button
            variant="primary"
            size="md"
            onClick={onAddNewProduct}
            icon={Plus}
            className="shadow-xs ml-auto sm:ml-0"
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Informative Hybrid Banner: When both search & category are active */}
      {searchQuery && selectedCategory && (
        <div className="flex items-center justify-between text-xs bg-indigo-50/70 border border-indigo-200/70 text-indigo-900 px-3.5 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>
              Searching for <strong>"{searchQuery}"</strong> inside{' '}
              <strong>"{selectedCategory}"</strong> (client-side filtered).
            </span>
          </div>
          <span className="text-[11px] text-indigo-700/80 hidden sm:inline">
            DummyJSON API limits combined search; refined locally.
          </span>
        </div>
      )}
    </div>
  );
}
