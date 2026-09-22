import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PackageSearch,
  Search,
  Clock,
  MapPin,
  CheckCircle2,
  Truck,
  Package,
  AlertCircle,
} from 'lucide-react';
import { api, formatPKR } from '../utils/api';

const statusSteps = ['Pending', 'Confirmed', 'Dispatched', 'Delivered'];

const statusIcons = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  Dispatched: Truck,
  Delivered: Package,
};

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = searchParams.get('order');
    if (id) {
      setOrderId(id);
      api.get(`/orders/track/${id}`).then(setOrder).catch((err) => setError(err.message));
    }
  }, [searchParams]);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const data = await api.get(`/orders/track/${orderId.trim()}`);
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-2">
        <PackageSearch className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-bold text-stone-100">Track Order</h1>
      </div>
      <p className="text-stone-400 mb-8 ml-11">
        Enter your order ID to check delivery status
      </p>

      <form onSubmit={handleTrack} className="card p-6 mb-8">
        <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
          <Search className="w-4 h-4 text-amber-500" />
          Order ID
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Paste your order ID here"
            className="input-field flex-1"
          />
          <button type="submit" disabled={loading} className="btn-primary shrink-0">
            <PackageSearch className="w-4 h-4" />
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
      </form>

      {error && (
        <div className="flex items-center gap-3 card p-4 border-red-500/30 text-red-400 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {order && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-stone-500 mb-1">Order ID</p>
              <p className="font-mono text-sm text-stone-300 break-all">{order._id}</p>
            </div>
            <span className="badge bg-amber-500/10 text-amber-500 border border-amber-500/30 text-sm">
              {order.status}
            </span>
          </div>

          <div className="flex items-center justify-between mb-8 px-2">
            {statusSteps.map((step, idx) => {
              const Icon = statusIcons[step];
              const done = idx <= currentStep;
              const active = idx === currentStep;
              return (
                <div key={step} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      done
                        ? 'bg-amber-500 border-amber-500 text-slate-950'
                        : 'border-stone-600 text-stone-600'
                    } ${active ? 'ring-4 ring-amber-500/20' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-medium ${done ? 'text-amber-500' : 'text-stone-600'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-stone-300">
              <Package className="w-4 h-4 text-amber-500" />
              <span className="text-stone-500">Material:</span> {order.material}
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span className="text-stone-500">City:</span> {order.city}
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-stone-500">Placed:</span>{' '}
              {new Date(order.createdAt).toLocaleString('en-PK')}
            </div>
            <div className="pt-3 border-t border-stone-600/60 flex justify-between items-center">
              <span className="text-stone-400">Total Price</span>
              <span className="text-xl font-bold text-amber-500">{formatPKR(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
