import bcrypt from 'bcryptjs';
import { isDbReady } from '../config/db.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import {
  mockProducts,
  mockOrders,
  mockAdmin,
  generateId,
  PUNJAB_CITIES,
  FREIGHT_RATES,
} from '../data/mockStore.js';

export { PUNJAB_CITIES, FREIGHT_RATES };

export const getAllProducts = async (filter = {}) => {
  if (isDbReady()) {
    const query = {};
    if (filter.inStock !== undefined) query.inStock = filter.inStock;
    if (filter.category) query.category = filter.category;
    return Product.find(query).sort({ createdAt: -1 }).lean();
  }
  let list = [...mockProducts];
  if (filter.inStock !== undefined) list = list.filter((p) => p.inStock === filter.inStock);
  if (filter.category) list = list.filter((p) => p.category === filter.category);
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getProductById = async (id) => {
  if (isDbReady()) return Product.findById(id).lean();
  return mockProducts.find((p) => p._id === id) || null;
};

export const createProduct = async (data) => {
  if (isDbReady()) {
    const product = await Product.create(data);
    return product.toObject();
  }
  const product = {
    _id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProducts.unshift(product);
  return product;
};

export const updateProduct = async (id, data) => {
  if (isDbReady()) {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }
  const idx = mockProducts.findIndex((p) => p._id === id);
  if (idx === -1) return null;
  mockProducts[idx] = { ...mockProducts[idx], ...data, updatedAt: new Date().toISOString() };
  return mockProducts[idx];
};

export const deleteProduct = async (id) => {
  if (isDbReady()) {
    const product = await Product.findByIdAndDelete(id);
    return product ? product.toObject() : null;
  }
  const idx = mockProducts.findIndex((p) => p._id === id);
  if (idx === -1) return null;
  const removed = mockProducts.splice(idx, 1)[0];
  return removed;
};

export const createOrder = async (data) => {
  if (isDbReady()) {
    const order = await Order.create(data);
    return order.toObject();
  }
  const order = {
    _id: generateId(),
    ...data,
    status: data.status || 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockOrders.unshift(order);
  return order;
};

export const getAllOrders = async (filter = {}) => {
  if (isDbReady()) {
    const query = {};
    if (filter.city) query.city = filter.city;
    if (filter.status) query.status = filter.status;
    return Order.find(query).sort({ createdAt: -1 }).lean();
  }
  let list = [...mockOrders];
  if (filter.city) list = list.filter((o) => o.city === filter.city);
  if (filter.status) list = list.filter((o) => o.status === filter.status);
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getOrderById = async (id) => {
  if (isDbReady()) return Order.findById(id).lean();
  return mockOrders.find((o) => o._id === id) || null;
};

export const updateOrderStatus = async (id, status) => {
  if (isDbReady()) {
    return Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
  }
  const order = mockOrders.find((o) => o._id === id);
  if (!order) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
};

export const getAdminStats = async () => {
  const orders = await getAllOrders();
  const products = await getAllProducts();
  const pending = orders.filter((o) => o.status === 'Pending').length;
  const delivered = orders.filter((o) => o.status === 'Delivered');
  const totalRevenue = delivered.reduce((s, o) => s + o.totalPrice, 0);
  const grossRevenue = orders.reduce((s, o) => s + o.totalPrice, 0);

  return {
    totalOrders: orders.length,
    totalRevenue,
    grossRevenue,
    pendingDeliveries: pending,
    activeCatalogItems: products.filter((p) => p.inStock).length,
  };
};

export const findAdminUser = async (username) => {
  if (isDbReady()) return User.findOne({ username }).lean();
  if (mockAdmin.username === username) return mockAdmin;
  return null;
};

export const verifyAdminPassword = async (user, password) => {
  return bcrypt.compare(password, user.password);
};

export const seedAdminIfNeeded = async () => {
  if (!isDbReady()) return;
  const existing = await User.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await User.create({ username: process.env.ADMIN_USERNAME || 'admin', password: hashed });
  }
};

export const calculateFreight = (city, vehicleType, quantity) => {
  const normalized = PUNJAB_CITIES.find((c) => c.toLowerCase() === city.toLowerCase());
  if (!normalized) return { error: 'City not in delivery coverage', freight: 0, city: null };

  const rates = FREIGHT_RATES[normalized];
  const rate = vehicleType === 'Dumper' ? rates.dumper : rates.trolley;
  const freight = rate * (Number(quantity) || 0);

  return { city: normalized, freight, rate, vehicleType, quantity: Number(quantity) || 0 };
};

export const calculateQuote = (product, vehicleType, quantity, city) => {
  const qty = Number(quantity) || 1;
  const unitPrice =
    vehicleType === 'Dumper' ? product.pricePerDumper : product.pricePerTrolley;
  const materialCost = unitPrice * qty;
  const freightResult = calculateFreight(city, vehicleType, qty);
  if (freightResult.error) return freightResult;

  return {
    city: freightResult.city,
    materialCost,
    freightCharge: freightResult.freight,
    totalPrice: materialCost + freightResult.freight,
    unitPrice,
    quantity: qty,
    vehicleType,
  };
};
