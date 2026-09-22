import { useEffect, useState } from 'react';
import {
  Calculator as CalcIcon,
  Layers,
  Truck,
  Package,
  Hash,
  MapPin,
  Receipt,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { api, formatPKR } from '../utils/api';
import ProductVisual from './ProductVisual';

const Calculator = ({ embedded = false }) => {
  const [products, setProducts] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    productId: '',
    vehicleType: 'Dumper',
    quantity: 1,
    city: 'Sargodha',
  });
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products?inStock=true').then((data) => {
      setProducts(data);
      if (data.length) setForm((f) => ({ ...f, productId: data[0]._id }));
    }).catch(console.error);
    api.get('/products/cities').then(setCities).catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.productId || !form.city) return;
    setLoading(true);
    setError('');
    api
      .post('/products/quote', form)
      .then(setQuote)
      .catch((err) => {
        setError(err.message);
        setQuote(null);
      })
      .finally(() => setLoading(false));
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'quantity' ? Math.max(1, Number(value)) : value }));
  };

  const selectedProduct = products.find((p) => p._id === form.productId);

  const wrapperClass = embedded ? 'max-w-4xl mx-auto' : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10';

  return (
    <div className={wrapperClass}>
      {!embedded && (
        <>
          <div className="flex items-center gap-3 mb-2">
            <CalcIcon className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-bold text-stone-100">Punjab Freight Estimator</h1>
          </div>
          <p className="text-stone-400 mb-8 ml-11">
            Material cost + distance freight = live PKR total
          </p>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
              <Layers className="w-4 h-4 text-amber-500" />
              Material Type
            </label>
            <select name="productId" value={form.productId} onChange={handleChange} className="input-field">
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
              <Truck className="w-4 h-4 text-amber-500" />
              Vehicle Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'Dumper', label: 'Dumper (1000 Cu.Ft)', icon: Truck },
                { value: 'Trolley', label: 'Trolley (150 Cu.Ft)', icon: Package },
              ].map(({ value, label, icon: VIcon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, vehicleType: value }))}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all active:scale-95 ${
                    form.vehicleType === value
                      ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                      : 'border-stone-600/60 text-stone-400 hover:border-stone-500'
                  }`}
                >
                  <VIcon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
              <Hash className="w-4 h-4 text-amber-500" />
              Quantity
            </label>
            <input type="number" name="quantity" min="1" value={form.quantity} onChange={handleChange} className="input-field" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              Destination City (Punjab)
            </label>
            <select name="city" value={form.city} onChange={handleChange} className="input-field">
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Receipt className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-stone-100">Live PKR Quote</h2>
          </div>

          {loading && <p className="text-stone-400 flex items-center gap-2"><CalcIcon className="w-4 h-4" /> Calculating...</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {quote && !loading && selectedProduct && (
            <div className="space-y-4 animate-fade-in">
              <div className="rounded-xl overflow-hidden border border-stone-600/60">
                <ProductVisual product={selectedProduct} compact showDetailLink={false} />
                <div className="p-3 bg-[#1e293b]">
                  <p className="font-semibold text-stone-100 text-sm">{selectedProduct.title}</p>
                  <p className="text-xs text-stone-500">
                    {form.quantity} x {form.vehicleType} → {quote.city}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400 flex items-center gap-1"><Layers className="w-3.5 h-3.5" />Material Cost</span>
                  <span className="text-stone-200 font-medium">{formatPKR(quote.materialCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400 flex items-center gap-1"><Truck className="w-3.5 h-3.5" />Freight Surcharge</span>
                  <span className="text-stone-200 font-medium">{formatPKR(quote.freightCharge)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-600/60">
                  <span className="text-lg font-bold text-stone-100">Estimated Total</span>
                  <span className="text-2xl font-extrabold text-amber-500">{formatPKR(quote.totalPrice)}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/923017367553?text=${encodeURIComponent(
                  `Assalam-o-Alaikum Rao Afzal Sb, I want to place an order from Rao Stone Traders website. Details: Material: ${selectedProduct.title}, Quantity: ${form.quantity} ${form.vehicleType}, City: ${quote.city}, Estimated Total: ${formatPKR(quote.totalPrice)}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-emerald w-full active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                Confirm via WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
