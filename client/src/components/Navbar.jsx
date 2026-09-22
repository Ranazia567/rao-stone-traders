import { Link, useLocation } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Home,
  Layers,
  Calculator,
  PackageSearch,
  Shield,
  ShoppingCart,
  Mountain,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { itemCount } = useCart();
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/shop', label: 'Stone Catalog', icon: Layers },
    { to: '/freight', label: 'Punjab Freight Estimator', icon: Calculator },
    { to: '/track', label: 'Track Order', icon: PackageSearch },
    { to: '/login', label: 'Admin Portal', icon: Shield },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-stone-600/40 border-b border-stone-600/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2 text-stone-300">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Pul 111 Faisalabad Road, Sargodha</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:03017367553"
              className="inline-flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Rao Afzal: 0301-7367553
            </a>
            <a
              href="tel:03453413730"
              className="inline-flex items-center gap-1.5 text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Rao Mehtab: 0345-3413730
            </a>
            <a
              href="https://wa.me/923017367553"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-3 py-1 rounded-lg transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <nav className="bg-slate-950/95 backdrop-blur-md border-b border-stone-600/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mountain className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="text-lg font-bold text-stone-100 block leading-tight">
                  Rao Stone Traders
                </span>
                <span className="text-xs text-amber-500 font-medium">راؤ اسٹون ٹریڈرز</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(to)
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'text-stone-300 hover:text-amber-500 hover:bg-stone-600/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <Link
                to="/cart"
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ml-1 ${
                  isActive('/cart')
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'text-stone-300 hover:text-amber-500 hover:bg-stone-600/30'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Cart
                {itemCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>

            <Link
              to="/cart"
              className="lg:hidden inline-flex items-center gap-1.5 bg-stone-600/50 px-3 py-2 rounded-lg text-sm"
            >
              <ShoppingCart className="w-4 h-4 text-amber-500" />
              {itemCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs font-bold px-1.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-1 pb-3 overflow-x-auto scrollbar-hide">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${
                  isActive(to) ? 'bg-amber-500 text-slate-950' : 'bg-stone-600/40 text-stone-300'
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
