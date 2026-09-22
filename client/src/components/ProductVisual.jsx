import { Link } from 'react-router-dom';
import { Eye, Package, Truck, Boxes } from 'lucide-react';
import { resolveMaterialVisual } from '../utils/materialVisuals';

const ProductVisual = ({ product, compact = false, showDetailLink = true }) => {
  const { theme, Icon } = resolveMaterialVisual(product);
  const height = compact ? 'h-28' : 'aspect-[4/3]';

  return (
    <div
      className={`relative ${height} overflow-hidden bg-[#1e293b] bg-gradient-to-br ${theme.gradient} group/visual`}
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/5 blur-2xl animate-pulse-slow" />
      </div>

      <div className="absolute top-3 right-3 badge border border-stone-600/60 bg-slate-950/70 text-stone-300 text-[10px]">
        <Truck className="w-3 h-3 text-amber-500" />
        Per Dumper / Trolley
      </div>

      {!product.inStock && (
        <span className="absolute top-3 left-3 badge bg-red-500/20 text-red-400 border border-red-500/40">
          Out of Stock
        </span>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div
          className={`rounded-2xl p-4 ring-2 ${theme.ring} bg-slate-950/50 backdrop-blur-sm transition-all duration-300 group-hover/visual:scale-110 group-hover/visual:shadow-xl ${theme.glow}`}
        >
          <Icon className={`${theme.icon} ${compact ? 'w-8 h-8' : 'w-14 h-14'}`} strokeWidth={1.5} />
        </div>
        {!compact && (
          <p className="mt-3 text-xs font-medium text-stone-400 text-center">{product.qualityLabel}</p>
        )}
      </div>

      <span className={`absolute bottom-3 left-3 badge border ${theme.badge}`}>
        {product.tag}
      </span>

      <span className="absolute bottom-3 right-3 badge bg-slate-950/80 text-emerald-500 border border-emerald-500/30">
        <Boxes className="w-3 h-3" />
        {product.stockCount ?? 0} units
      </span>

      {showDetailLink && product._id && !compact && (
        <Link
          to={`/product/${product._id}`}
          className="absolute top-1/2 right-3 -translate-y-1/2 p-2 bg-slate-950/80 rounded-lg text-amber-500 opacity-0 group-hover/visual:opacity-100 transition-opacity"
        >
          <Eye className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};

export default ProductVisual;
