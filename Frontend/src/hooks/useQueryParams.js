import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';

const ALLOWED_LIMITS = [10, 20, 50];

/**
 * Custom hook to manage and sanitize dashboard query params in URL
 * Guaranteed to never crash on invalid inputs like ?page=abc or ?limit=999
 */
export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse & sanitize query params
  const params = useMemo(() => {
    // Page: must be integer >= 1
    const rawPage = searchParams.get('page');
    let page = parseInt(rawPage, 10);
    if (isNaN(page) || page < 1) {
      page = 1;
    }

    // Limit: must be one of allowed limits, default 10
    const rawLimit = searchParams.get('limit');
    let limit = parseInt(rawLimit, 10);
    if (!ALLOWED_LIMITS.includes(limit)) {
      limit = 10;
    }

    // Search query: string
    const q = searchParams.get('q') || '';

    // Category: string slug
    const category = searchParams.get('category') || '';

    // SortBy: 'title' | 'price' | 'rating' or empty
    const rawSort = searchParams.get('sortBy') || '';
    const sortBy = ['title', 'price', 'rating'].includes(rawSort) ? rawSort : '';

    // Order: 'asc' | 'desc', default 'asc'
    const rawOrder = searchParams.get('order') || 'asc';
    const order = rawOrder === 'desc' ? 'desc' : 'asc';

    return {
      page,
      limit,
      q,
      category,
      sortBy,
      order,
    };
  }, [searchParams]);

  /**
   * Helper to update query params while preserving or clearing specific keys
   */
  const setParams = useCallback((newParams) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      Object.entries(newParams).forEach(([key, val]) => {
        if (val === undefined || val === null || val === '') {
          next.delete(key);
        } else {
          next.set(key, String(val));
        }
      });

      return next;
    }, { replace: true });
  }, [setSearchParams]);

  return {
    params,
    setParams,
  };
}
