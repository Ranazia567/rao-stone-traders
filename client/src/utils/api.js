const API_BASE = '/api';

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
};

export const api = {
  get: (endpoint, token) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return request(endpoint, { headers });
  },

  post: (endpoint, data, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return request(endpoint, { method: 'POST', headers, body: JSON.stringify(data) });
  },

  put: (endpoint, data, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return request(endpoint, { method: 'PUT', headers, body: JSON.stringify(data) });
  },

  delete: (endpoint, token) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return request(endpoint, { method: 'DELETE', headers });
  },
};

export const formatPKR = (amount) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

export const buildWhatsAppMessage = (order) => {
  const materialLine = order.items?.length
    ? order.items.map((i) => `${i.title} x${i.quantity} (${i.vehicleType})`).join(', ')
    : order.material;

  const text =
    `Assalam-o-Alaikum Rao Afzal Sb, I want to place an order from Rao Stone Traders website. ` +
    `Details: Material: ${materialLine}, Quantity: ${order.quantity}, City: ${order.city}, ` +
    `Delivery Address: ${order.address}, Estimated Total: ${formatPKR(order.totalPrice)}`;

  return encodeURIComponent(text);
};

export const openWhatsApp = (order) => {
  window.open(`https://wa.me/923017367553?text=${buildWhatsAppMessage(order)}`, '_blank');
};

export const buildProductWhatsApp = (product, vehicleType, quantity, city, total) => {
  const text =
    `Assalam-o-Alaikum Rao Afzal Sb, I want to place an order from Rao Stone Traders website. ` +
    `Details: Material: ${product.title}, Quantity: ${quantity} ${vehicleType}, City: ${city}, ` +
    `Estimated Total: ${formatPKR(total)}`;
  window.open(`https://wa.me/923017367553?text=${encodeURIComponent(text)}`, '_blank');
};
