export const FALLBACK_PRODUCTS = [
  {
    _id: "1",
    title: "Awwal Red Bricks & Roof Tiles",
    category: "Building Structure",
    pricePerDumper: 45000,
    pricePerTrolley: 8000,
    image: "https://marketdeals.pk/wp-content/uploads/2021/02/Awwal-Bricks-A-Class.jpg",
    description: "First-grade Awwal red clay bricks and roof tiles for structural construction.",
    inStock: true,
    qualityLabel: "Awwal First Grade",
    tag: "Building Structure"
  },
  {
    _id: "2",
    title: "Water Bound Macadam (WBM Road Base)",
    category: "Road Construction",
    pricePerDumper: 32000,
    pricePerTrolley: 5800,
    image: "https://materialprovider.com/wp-content/uploads/2025/09/ec4043eb-78a3-4e8f-b8f6-27e57a147baf.jpg",
    description: "Coarse road-base aggregate mix for sub-base highway compaction.",
    inStock: true,
    qualityLabel: "Highway WBM Spec",
    tag: "Road Construction"
  },
  {
    _id: "3",
    title: "Washed Clean Gravel (Saf Bajri)",
    category: "Filtered Aggregate",
    pricePerDumper: 42000,
    pricePerTrolley: 7200,
    image: "https://bayridgelandscaping.com/wp-content/uploads/2025/03/ChatGPT-Image-Mar-26-2025-12_52_47-PM.png",
    description: "Triple-washed clean gravel free from dust and soil impurities.",
    inStock: true,
    qualityLabel: "Premium Washed Grade",
    tag: "Filtered Aggregate"
  },
  {
    _id: "4",
    title: "Chenab River Sand (Rait)",
    category: "Masonry & Plaster",
    pricePerDumper: 24000,
    pricePerTrolley: 4500,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2nS97k5cTGl0ukg8cCfYqvVchUiIZAEE3q-rLPm_EMg&s=10",
    description: "Clean fine-grain Chenab river sand ideal for plaster and masonry.",
    inStock: true,
    qualityLabel: "Chenab River Grade",
    tag: "Masonry & Plaster"
  },
  {
    _id: "5",
    title: "Stone Dust / Sub-base Khak",
    category: "Block Filling & Sub-base",
    pricePerDumper: 20000,
    pricePerTrolley: 3800,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwMc1-KdAbMUWj28p_eH9Pm38yDIrXAOEc32xSOIYqLQ&s=10",
    description: "Fine crushed stone dust for floor base compaction and paver filling.",
    inStock: true,
    qualityLabel: "Compacted Fill Grade",
    tag: "Block Filling"
  },
  {
    _id: "6",
    title: "Sargodha Bajri (1/2\" & 3/4\" Crush)",
    category: "Roofing & Concrete Slabs",
    pricePerDumper: 38000,
    pricePerTrolley: 6500,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrGi4Me45jTRW-lmgOqW-bBWUxynjCu5n0SjNrWA52yA&s=10",
    description: "High-density crushed stone aggregate for reinforced concrete slabs.",
    inStock: true,
    qualityLabel: "Grade-A Sargodha Stone",
    tag: "Roofing & Slabs"
  }
];

const PUNJAB_CITIES = ['Sargodha', 'Lahore', 'Faisalabad', 'Gujranwala', 'Rawalpindi', 'Multan', 'Sahiwal', 'Sheikhupura'];

const FREIGHT_RATES = {
  Sargodha: { dumper: 0, trolley: 0 },
  Lahore: { dumper: 8500, trolley: 1500 },
  Faisalabad: { dumper: 6500, trolley: 1200 },
  Gujranwala: { dumper: 9000, trolley: 1600 },
  Rawalpindi: { dumper: 12000, trolley: 2200 },
  Multan: { dumper: 11000, trolley: 2000 },
  Sahiwal: { dumper: 7500, trolley: 1400 },
  Sheikhupura: { dumper: 8000, trolley: 1450 },
};

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

const request = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: options.signal || controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Request failed');
    }
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const api = {
  get: async (endpoint, token) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
      return await request(endpoint, { headers });
    } catch {
      if (endpoint.startsWith('/products/cities')) {
        return PUNJAB_CITIES;
      }
      if (endpoint.startsWith('/products/')) {
        const id = endpoint.split('/')[2];
        const found = FALLBACK_PRODUCTS.find((p) => p._id === id);
        if (found) return found;
      }
      if (endpoint.startsWith('/products')) {
        const url = new URL('http://dummy' + endpoint);
        const cat = url.searchParams.get('category');
        if (cat && cat !== 'All') {
          return FALLBACK_PRODUCTS.filter((p) => p.category.toLowerCase().includes(cat.toLowerCase()));
        }
        return FALLBACK_PRODUCTS;
      }
      throw new Error('Request failed');
    }
  },

  post: async (endpoint, data, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
      return await request(endpoint, { method: 'POST', headers, body: JSON.stringify(data) });
    } catch (error) {
      if (endpoint === '/products/quote') {
        const product = FALLBACK_PRODUCTS.find((p) => p._id === data.productId) || FALLBACK_PRODUCTS[0];
        const qty = Number(data.quantity) || 1;
        const unitPrice = data.vehicleType === 'Dumper' ? product.pricePerDumper : product.pricePerTrolley;
        const materialCost = unitPrice * qty;
        const cityRate = FREIGHT_RATES[data.city] || FREIGHT_RATES['Sargodha'];
        const rate = data.vehicleType === 'Dumper' ? cityRate.dumper : cityRate.trolley;
        const freightCharge = rate * qty;
        return {
          product: { _id: product._id, title: product.title },
          city: data.city || 'Sargodha',
          materialCost,
          freightCharge,
          totalPrice: materialCost + freightCharge,
          unitPrice,
          quantity: qty,
          vehicleType: data.vehicleType || 'Dumper',
        };
      }
      if (endpoint === '/products/freight') {
        const cityRate = FREIGHT_RATES[data.city] || FREIGHT_RATES['Sargodha'];
        const qty = Number(data.quantity) || 1;
        const rate = data.vehicleType === 'Dumper' ? cityRate.dumper : cityRate.trolley;
        return {
          city: data.city || 'Sargodha',
          freight: rate * qty,
          rate,
          vehicleType: data.vehicleType || 'Dumper',
          quantity: qty,
        };
      }
      throw error;
    }
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
