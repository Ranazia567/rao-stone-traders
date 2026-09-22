import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  Package,
  ShoppingCart,
  MessageCircle,
  MapPin,
  Hash,
  Calculator,
  Award,
  Boxes,
} from 'lucide-react';
import { api, formatPKR, buildProductWhatsApp } from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductVisual from '../components/ProductVisual';
import { resolveMaterialVisual } from '../utils/materialVisuals';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicleType, setVehicleType] = useState('Dumper');
  const [quantity, setQuantity] = useState(1);
  const [city, setCity] = useState('Sargodha');
  const [quote, setQuote] = useState(null);
  const [added, setAdded] = useState(false);
  const { theme } = resolveMaterialVisual(product);

  useEffect(() => {
    api.get(`/products/${id}`).then(setProduct).catch(console.error).finally(() => setLoading(false));
    api.get('/products/cities').then(setCities).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!product) return;
    api
      .post('/products/quote', { productId: product._id, vehicleType, quantity, city })
      .then(setQuote)
      .catch(() => setQuote(null));
  }, [product, vehicleType, quantity, city]);

  if (loading) return <div className="text-center text-stone-400 py-20">Loading...</div>;
  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-400 mb-4">Product not found.</p>
        <Link to="/shop" className="btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, vehicleType, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    buildProductWhatsApp(product, vehicleType, quantity, city, quote?.totalPrice || 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/shop" className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-400 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Stone Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="card overflow-hidden">
          <ProductVisual product={product} showDetailLink={false} />
        </div>

        <div>
          <span className={`badge border ${theme.badge} mb-3`}>{product.tag}</span>
          <h1 className="text-3xl font-bold text-stone-100 mb-2">{product.title}</h1>
          <p className="flex items-center gap-2 text-sm text-stone-500 mb-4">
            <Award className={`w-4 h-4 ${theme.icon}`} />
            {product.qualityLabel}
          </p>
          <p className="text-stone-300 leading-relaxed mb-4">{product.description}</p>
          <p className="inline-flex items-center gap-2 text-sm text-emerald-500 mb-6">
            <Boxes className="w-4 h-4" />
            Live stock: {product.stockCount} units
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="card p-4 text-center">
              <Truck className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-xs text-stone-500">Per Dumper</p>
              <p className="text-lg font-bold text-amber-500">{formatPKR(product.pricePerDumper)}</p>
            </div>
            <div className="card p-4 text-center">
              <Package className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-xs text-stone-500">Per Trolley</p>
              <p className="text-lg font-bold text-emerald-500">{formatPKR(product.pricePerTrolley)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {['Dumper', 'Trolley'].map((v) => (
              <button
                key={v}
                onClick={() => setVehicleType(v)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-95 ${
                  vehicleType === v ? 'bg-amber-500 text-slate-950' : 'bg-stone-600/30 text-stone-400'
                }`}
              >
                {v === 'Dumper' ? <Truck className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Hash className="w-4 h-4 text-stone-500" />
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 bg-stone-600/40 rounded-lg active:scale-90">-</button>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} className="input-field w-20 text-center" />
            <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 bg-stone-600/40 rounded-lg active:scale-90">+</button>
          </div>

          <div className="flex gap-3 mb-8">
            <button onClick={handleAdd} disabled={!product.inStock} className="btn-primary flex-1 disabled:opacity-40 active:scale-95">
              <ShoppingCart className="w-4 h-4" />
              {added ? 'Added!' : 'Add to Cart'}
            </button>
            <button onClick={handleWhatsApp} className="btn-emerald flex-1 active:scale-95">
              <MessageCircle className="w-4 h-4" />
              Order via WhatsApp
            </button>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-stone-100">Live Price Calculator</h2>
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm text-stone-400 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                Delivery City
              </label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="input-field">
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {quote && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-400">Material</span>
                  <span>{formatPKR(quote.materialCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Freight</span>
                  <span>{formatPKR(quote.freightCharge)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-stone-600/60">
                  <span className="text-stone-100">Total</span>
                  <span className="text-amber-500">{formatPKR(quote.totalPrice)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
