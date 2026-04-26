import api from './api';

export const getProducts = (params = {}) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);

// Crear producto usando FormData para soporte de imágenes físicas
export const createProduct = (formData) => api.post('/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Actualizar producto usando FormData
export const updateProduct = (id, formData) => api.put(`/products/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const deleteProduct = (id) => api.delete(`/products/${id}`);

export default { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
