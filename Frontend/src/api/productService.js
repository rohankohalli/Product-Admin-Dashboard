import api from './axiosInstance';

/**
 * Product API service functions using centralized Axios instance
 * All functions accept an optional AbortSignal to cancel in-flight requests
 */

export async function fetchProducts({
  limit = 10,
  skip = 0,
  sortBy = '',
  order = 'asc',
  signal,
} = {}) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  const response = await api.get('/products', { params, signal });
  return response.data;
}

export async function searchProducts({
  q = '',
  limit = 10,
  skip = 0,
  sortBy = '',
  order = 'asc',
  signal,
} = {}) {
  const params = { q, limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  const response = await api.get('/products/search', { params, signal });
  return response.data;
}

export async function fetchByCategory({
  category,
  limit = 10,
  skip = 0,
  sortBy = '',
  order = 'asc',
  signal,
} = {}) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  const response = await api.get(`/products/category/${encodeURIComponent(category)}`, {
    params,
    signal,
  });
  return response.data;
}

export async function fetchCategories({ signal } = {}) {
  const response = await api.get('/products/categories', { signal });
  return response.data;
}

export async function fetchProductById(id, { signal } = {}) {
  const response = await api.get(`/products/${id}`, { signal });
  return response.data;
}

export async function createProduct(productData) {
  const response = await api.post('/products/add', productData);
  return response.data;
}

export async function updateProduct(id, productData) {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
