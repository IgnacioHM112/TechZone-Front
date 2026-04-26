import api from './api';

export const createPreference = () => api.post('/orders/create-preference');
export const confirmOrder = (data) => api.post('/orders/confirm', data);
export const getOrderDetails = (id) => api.get(`/orders/${id}`);

// Nuevo: Descarga de comprobante PDF desde el servidor
export const downloadOrderReceipt = (id) => api.get(`/orders/${id}/download`, {
  responseType: 'blob'
});

export default { createPreference, confirmOrder, getOrderDetails, downloadOrderReceipt };
