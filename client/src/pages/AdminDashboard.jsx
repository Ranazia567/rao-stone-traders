import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  LogOut,
  Home,
  DollarSign,
  Clock,
  Layers,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Filter,
  ToggleLeft,
  ToggleRight,
  Mountain,
  Tag,
  Award,
  Boxes,
  Palette,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, formatPKR } from '../utils/api';
import { resolveMaterialVisual, ICON_MAP } from '../utils/materialVisuals';

const TABS = [
  { id: 'metrics', label: 'Overview', icon: LayoutDashboard },
  { id: 'inventory', label: 'Product Manager', icon: Package },
  { id: 'orders', label: 'Order Manager', icon: ClipboardList },
];

const emptyProduct = {
  title: '',
  category: 'Roofing Crush',
  pricePerDumper: '',
  pricePerTrolley: '',
  description: '',
  iconKey: 'Layers',
  theme: 'amber',
  tag: '',
  qualityLabel: 'Grade-A Material',
  stockCount: 100,
  inStock: true,
};

const MaterialIconCell = ({ product }) => {
  const { theme, Icon } = resolveMaterialVisual(product);
  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-[#1e293b] ring-1 ${theme.ring}`}>
      <Icon className={`w-5 h-5 ${theme.icon}`} />
    </div>
  );
};

const AdminDashboard = () => {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('metrics');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cityFilter, setCityFilter] = useState('');
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const loadStats = () => api.get('/orders/stats', token).then(setStats).catch(console.error);
  const loadProducts = () => api.get('/products').then(setProducts).catch(console.error);
  const loadOrders = () => {
    const q = cityFilter ? `?city=${encodeURIComponent(cityFilter)}` : '';
    api.get(`/orders${q}`, token).then(setOrders).catch(console.error);
  };

  useEffect(() => {
    loadStats();
    loadProducts();
    loadOrders();
  }, [token, cityFilter]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      pricePerDumper: Number(form.pricePerDumper),
      pricePerTrolley: Number(form.pricePerTrolley),
      stockCount: Number(form.stockCount) || 0,
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload, token);
      } else {
        await api.post('/products', payload, token);
      }
      setForm(emptyProduct);
      setEditingId(null);
      setShowForm(false);
      loadProducts();
      loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title,
      category: p.category,
      pricePerDumper: p.pricePerDumper,
      pricePerTrolley: p.pricePerTrolley,
      description: p.description,
      iconKey: p.iconKey || 'Layers',
      theme: p.theme || 'amber',
      tag: p.tag || '',
      qualityLabel: p.qualityLabel || '',
      stockCount: p.stockCount ?? 0,
      inStock: p.inStock,
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`, token);
    loadProducts();
    loadStats();
  };

  const handleToggleStock = async (p) => {
    await api.put(`/products/${p._id}`, { inStock: !p.inStock }, token);
    loadProducts();
    loadStats();
  };

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status }, token);
    loadOrders();
    loadStats();
  };

  const statCards = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders, icon: ClipboardList, color: 'text-blue-400' },
        { label: 'Revenue', value: formatPKR(stats.totalRevenue), icon: DollarSign, color: 'text-emerald-500' },
        { label: 'Pending Deliveries', value: stats.pendingDeliveries, icon: Clock, color: 'text-amber-500' },
        { label: 'Active Materials', value: stats.activeCatalogItems, icon: Layers, color: 'text-purple-400' },
      ]
    : [];

  const orderCities = [...new Set(orders.map((o) => o.city))];

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <header className="bg-[#1e293b]/80 border-b border-stone-600/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mountain className="w-6 h-6 text-amber-500" />
          <div>
            <h1 className="font-bold text-stone-100">Admin Dashboard</h1>
            <p className="text-xs text-stone-500">Rao Stone Traders {user && `· ${user.username}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="btn-secondary text-sm py-2 active:scale-95">
            <Home className="w-4 h-4" />
            Store
          </Link>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-3 py-2 active:scale-95">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex border-b border-stone-600/60 px-6 gap-1 overflow-x-auto bg-[#1e293b]/40">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap active:scale-95 ${
              tab === id ? 'border-amber-500 text-amber-500' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {tab === 'metrics' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-6 hover:border-amber-500/30 transition-all">
                <Icon className={`w-6 h-6 ${color} mb-3`} />
                <p className="text-sm text-stone-500 mb-1">{label}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" />
                Product Manager
              </h2>
              <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyProduct); }} className="btn-primary text-sm active:scale-95">
                <Plus className="w-4 h-4" />
                Add Material
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleProductSubmit} className="card p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Title" className="input-field" />
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                  {['Roofing Crush', 'Premium Aggregate', 'Plaster Sand', 'Road Base', 'Masonry'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input type="number" value={form.pricePerDumper} onChange={(e) => setForm({ ...form, pricePerDumper: e.target.value })} required placeholder="Price per Dumper" className="input-field" />
                <input type="number" value={form.pricePerTrolley} onChange={(e) => setForm({ ...form, pricePerTrolley: e.target.value })} required placeholder="Price per Trolley" className="input-field" />
                <select value={form.iconKey} onChange={(e) => setForm({ ...form, iconKey: e.target.value })} className="input-field">
                  {Object.keys(ICON_MAP).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <select value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} className="input-field">
                  {['amber', 'blue', 'orange', 'slate', 'red', 'emerald'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="Tag (e.g. Roofing & Slabs)" className="input-field" />
                <input value={form.qualityLabel} onChange={(e) => setForm({ ...form, qualityLabel: e.target.value })} placeholder="Quality label" className="input-field" />
                <input type="number" value={form.stockCount} onChange={(e) => setForm({ ...form, stockCount: e.target.value })} placeholder="Stock count" className="input-field" />
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Description" rows={2} className="input-field md:col-span-2 resize-none" />
                {error && <p className="text-red-400 text-sm md:col-span-2">{error}</p>}
                <div className="flex gap-3 md:col-span-2">
                  <button type="submit" className="btn-primary active:scale-95">{editingId ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary active:scale-95">Cancel</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-600/60 text-stone-500 text-left">
                    <th className="py-3 px-3">Material</th>
                    <th className="py-3 px-3">Tag</th>
                    <th className="py-3 px-3">Dumper</th>
                    <th className="py-3 px-3">Trolley</th>
                    <th className="py-3 px-3">Stock</th>
                    <th className="py-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-stone-600/30 hover:bg-[#1e293b]/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <MaterialIconCell product={p} />
                          <div>
                            <span className="font-medium text-stone-200 block">{p.title}</span>
                            <span className="text-xs text-stone-500 flex items-center gap-1">
                              <Palette className="w-3 h-3" />
                              {p.theme}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="badge bg-stone-600/30 text-stone-400 border border-stone-600/60">
                          <Tag className="w-3 h-3" />
                          {p.tag}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-amber-500">{formatPKR(p.pricePerDumper)}</td>
                      <td className="py-3 px-3 text-emerald-500">{formatPKR(p.pricePerTrolley)}</td>
                      <td className="py-3 px-3">
                        <button onClick={() => handleToggleStock(p)} className="inline-flex items-center gap-1 active:scale-95">
                          {p.inStock ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-stone-500" />}
                          <span className={`flex items-center gap-1 ${p.inStock ? 'text-emerald-500' : 'text-stone-500'}`}>
                            <Boxes className="w-3 h-3" />
                            {p.stockCount ?? 0}
                          </span>
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(p)} className="text-amber-500 hover:text-amber-400 active:scale-90"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-300 active:scale-90"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-amber-500" />
                Order Manager
              </h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-stone-500" />
                <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="input-field w-auto text-sm py-2">
                  <option value="">All Cities</option>
                  {orderCities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-stone-500 flex items-center gap-2"><ClipboardList className="w-4 h-4" /> No orders found.</p>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="card p-5 hover:border-amber-500/20 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-stone-100 flex items-center gap-2">
                          <Award className="w-4 h-4 text-amber-500" />
                          {order.customerName}
                        </p>
                        <p className="text-sm text-stone-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {order.city} — {order.material}
                        </p>
                        <p className="text-xs text-stone-500 mt-1">{new Date(order.createdAt).toLocaleString('en-PK')}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-amber-500">{formatPKR(order.totalPrice)}</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="input-field w-auto text-sm py-2"
                        >
                          {['Pending', 'Confirmed', 'Dispatched', 'Delivered'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
