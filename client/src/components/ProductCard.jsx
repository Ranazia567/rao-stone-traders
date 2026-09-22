import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  MessageSquare,
  Truck,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { formatPKR } from '../utils/api';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [vehicleType, setVehicleType] = useState('Dumper');
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product?.image || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(product?.image || FALLBACK_IMAGE);
  }, [product?.image]);

  const unitPrice =
    vehicleType === 'Dumper' ? product.pricePerDumper : product.pricePerTrolley;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Rao Afzal Sb, I want to order ${product.title} (${vehicleType}). Price: ${formatPKR(unitPrice)}. Please confirm availability and delivery.`
    );
    window.open(`https://wa.me/923017367553?text=${text}`, '_blank');
  };

  const handleAdd = () => {
    addToCart(product, vehicleType, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="card group overflow-hidden border border-stone-800 bg-[#16202e] rounded-xl hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
      <div className="relative w-full h-48 overflow-hidden bg-slate-900">
        <img
          src={imgSrc}
          alt={product.title}
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-48 object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase rounded-md bg-slate-950/80 text-amber-400 border border-amber-500/30 backdrop-blur-sm">
          {product.category}
        </span>

        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-950/80 text-stone-300 border border-stone-700/60 backdrop-blur-sm">
          <Truck className="w-3 h-3 text-amber-500" />
          Dumper / Trolley
        </span>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-emerald-400 bg-slate-950/85 px-2 py-0.5 rounded border border-emerald-500/30 backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
          <span className="inline-flex items-center gap-1 text-stone-300 bg-slate-950/85 px-2 py-0.5 rounded border border-stone-700/50 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            {product.qualityLabel || 'Grade-A'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-stone-100 mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-stone-400 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-lg bg-slate-900/60 border border-stone-800/80 text-xs">
          <div>
            <span className="text-stone-500 block text-[10px] uppercase font-semibold">Dumper Rate</span>
            <span className="text-stone-200 font-bold">{formatPKR(product.pricePerDumper)}</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[10px] uppercase font-semibold">Trolley Rate</span>
            <span className="text-stone-200 font-bold">{formatPKR(product.pricePerTrolley)}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {['Dumper', 'Trolley'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setVehicleType(type)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                vehicleType === type
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-700/60'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-stone-800/80">
          <div>
            <span className="text-xs text-stone-500 mr-1.5">Selected:</span>
            <span className="text-xs font-medium text-stone-300">{vehicleType}</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-amber-400">{formatPKR(unitPrice)}</span>
            <span className="text-xs text-stone-500 ml-1">/{vehicleType.toLowerCase()}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-amber-500/10"
          >
            <ShoppingBag className="w-4 h-4" />
            {added ? 'Added!' : 'Add to Cart'}
          </button>
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-95 shadow-lg shadow-emerald-600/10"
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
