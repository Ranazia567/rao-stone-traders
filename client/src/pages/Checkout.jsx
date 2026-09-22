import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Home,
  MessageCircle,
  Truck,
  Receipt,
  Send,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api, formatPKR, openWhatsApp } from '../utils/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart, getItemPrice } = useCart();
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    city: 'Sargodha',
    address: '',
  });
  const [freight, setFreight] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items, navigate]);

  useEffect(() => {
    api.get('/products/cities').then(setCities).catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.city || items.length === 0) return;

    let totalFreight = 0;
    const promises = items.map((item) =>
      api.post('/products/freight', {
        city: form.city,
        vehicleType: item.vehicleType,
        quantity: item.quantity,
      })
    );

    Promise.all(promises)
      .then((results) => {
        totalFreight = results.reduce((s, r) => s + (r.freight || 0), 0);
        setFreight(totalFreight);
      })
      .catch(() => setFreight(0));
  }, [form.city, items]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const order = await api.post('/orders', {
        customerName: form.customerName,
        phone: form.phone,
        city: form.city,
        address: form.address,
        items: items.map((item) => ({
          productId: item.product._id,
          vehicleType: item.vehicleType,
          quantity: item.quantity,
        })),
      });

      openWhatsApp(order);
      clearCart();
      navigate(`/track?order=${order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const grandTotal = cartTotal + freight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/cart" className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-400 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold text-stone-100 mb-8 flex items-center gap-3">
        <Receipt className="w-7 h-7 text-amber-500" />
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
              <User className="w-4 h-4 text-amber-500" />
              Customer Name
            </label>
            <input name="customerName" value={form.customerName} onChange={handleChange} required className="input-field" placeholder="Full name" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
              <Phone className="w-4 h-4 text-emerald-500" />
              Phone Number
            </label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className="input-field" placeholder="03XX-XXXXXXX" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              Delivery City
            </label>
            <select name="city" value={form.city} onChange={handleChange} required className="input-field">
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
              <Home className="w-4 h-4 text-amber-500" />
              Full Site Address
            </label>
            <textarea name="address" value={form.address} onChange={handleChange} required rows={3} className="input-field resize-none" placeholder="Street, area, landmark..." />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-emerald w-full disabled:opacity-50">
            <Send className="w-4 h-4" />
            {submitting ? 'Placing Order...' : 'Place Order & Send via WhatsApp'}
            <MessageCircle className="w-4 h-4" />
          </button>
        </form>

        <div className="card p-6 h-fit">
          <h2 className="font-bold text-stone-100 mb-4 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-500" />
            Order Summary
          </h2>
          <div className="space-y-2 mb-4 text-sm">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between text-stone-400">
                <span className="truncate mr-2">{item.product.title} x{item.quantity}</span>
                <span className="text-stone-200">{formatPKR(getItemPrice(item))}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-600/60 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Material Subtotal</span>
              <span>{formatPKR(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-400 flex items-center gap-1"><Truck className="w-3.5 h-3.5" />Freight to {form.city}</span>
              <span>{formatPKR(freight)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-stone-600/60">
              <span>Total</span>
              <span className="text-amber-500">{formatPKR(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
