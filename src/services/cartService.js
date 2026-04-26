import api from './api';

export const getCart = () => api.get('/cart');
export const addToCart = (product_id, quantity = 1) => api.post('/cart/add', { product_id, quantity });

/**
 * Elimina o resta unidades de un item del carrito.
 * @param {number} item_id - ID del registro en el carrito.
 * @param {number|null} quantity - Cantidad a restar. Si es null, elimina el producto por completo.
 */
export const removeItem = (item_id, quantity = null) => {
  // Para eliminar por completo no enviamos data
  if (!quantity) {
    return api.delete(`/cart/item/${item_id}`);
  }
  
  // Para restar enviamos la cantidad en la propiedad data (Requerido para DELETE en Axios)
  return api.delete(`/cart/item/${item_id}`, { 
    data: { quantity } 
  });
};

export const clearCart = () => api.delete('/cart/clear');

export default { getCart, addToCart, removeItem, clearCart };
