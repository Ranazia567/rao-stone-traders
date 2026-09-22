import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mountain,
  Truck,
  Calculator as CalcIcon,
  Phone,
  MessageCircle,
  Layers,
  ArrowRight,
  Package,
  MapPin,
} from 'lucide-react';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Calculator from '../components/Calculator';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products?inStock=true')
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const features = [
    { icon: Layers, title: 'Stone Catalog', desc: 'Crush, gravel, sand, bricks & WBM', to: '/shop' },
    { icon: CalcIcon, title: 'Freight Estimator', desc: 'Live PKR quotes across Punjab', to: '/freight' },
    { icon: Truck, title: 'Dumper & Trolley', desc: '1000 Cu.Ft & 150 Cu.Ft units', to: '/shop' },
    { icon: Package, title: 'Track Orders', desc: 'Real-time delivery status', to: '/track' },
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-stone-600/10 to-slate-950" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 badge bg-amber-500/10 text-amber-500 border border-amber-500/30 mb-6">
              <MapPin className="w-3.5 h-3.5" />
              Sargodha&apos;s Premier Stone Supplier
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-100 leading-tight mb-3">
              Rao Stone Traders
            </h1>
            <p className="text-2xl text-amber-500 font-bold mb-6">راؤ اسٹون ٹریڈرز</p>
            <p className="text-lg text-stone-300 leading-relaxed mb-8 max-w-2xl">
              Premium stone crushing and construction materials delivered across Punjab.
              Pul 111, Faisalabad Road, Sargodha — trusted by builders statewide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary text-base">
                <Layers className="w-5 h-5" />
                Browse Stone Catalog
              </Link>
              <Link to="/freight" className="btn-outline text-base">
                <CalcIcon className="w-5 h-5" />
                Get Freight Quote
              </Link>
              <a href="tel:03017367553" className="btn-secondary text-base">
                <Phone className="w-5 h-5" />
                Call Rao Afzal
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 border-y border-stone-600/40 bg-stone-600/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc, to }) => (
            <Link
              key={title}
              to={to}
              className="card p-5 hover:border-amber-500/40 transition-all group"
            >
              <Icon className="w-8 h-8 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-stone-100 mb-1">{title}</h3>
              <p className="text-sm text-stone-400">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Mountain className="w-7 h-7 text-amber-500" />
              <h2 className="text-3xl font-bold text-stone-100">Featured Materials</h2>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-400 font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center text-stone-400 py-16">Loading catalog...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 border-t border-stone-600/40 bg-[#1e293b]/20">
        <div className="max-w-7xl mx-auto mb-8 text-center">
          <div className="inline-flex items-center gap-2 badge bg-amber-500/10 text-amber-500 border border-amber-500/30 mb-3">
            <CalcIcon className="w-4 h-4" />
            Live Pricing
          </div>
          <h2 className="text-3xl font-bold text-stone-100">Punjab Freight Estimator</h2>
          <p className="text-stone-400 mt-2">Instant PKR quotes for any material and delivery city</p>
        </div>
        <Calculator embedded />
      </section>

      <section className="py-16 px-4 bg-stone-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-100 mb-4">Need Bulk Pricing?</h2>
          <p className="text-stone-400 mb-8">
            Contact Rao Afzal or Rao Mehtab for competitive rates on large orders across Punjab.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/923017367553" target="_blank" rel="noopener noreferrer" className="btn-emerald">
              <MessageCircle className="w-5 h-5" />
              WhatsApp Rao Afzal
            </a>
            <a href="tel:03453413730" className="btn-secondary">
              <Phone className="w-5 h-5" />
              Call Rao Mehtab
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
