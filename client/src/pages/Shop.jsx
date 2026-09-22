import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layers, Filter, Search } from 'lucide-react';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const activeCategory = searchParams.get('category') || '';

  const categories = [
    'All',
    'Roofing Crush',
    'Premium Aggregate',
    'Plaster Sand',
    'Road Base',
    'Masonry',
  ];

  useEffect(() => {
    setLoading(true);
    const endpoint = activeCategory
      ? `/products?category=${encodeURIComponent(activeCategory)}&inStock=true`
      : '/products?inStock=true';

    api
      .get(endpoint)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filtered = products.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const setCategory = (cat) => {
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Layers className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-bold text-stone-100">Stone Catalog</h1>
      </div>
      <p className="text-stone-400 mb-8 ml-11">
        Premium construction materials from Rao Stone Traders, Sargodha
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search materials..."
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-stone-500" />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = cat === 'All' ? !activeCategory : activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`badge border transition-all ${
                  active
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'bg-stone-600/30 text-stone-300 border-stone-600/60 hover:border-amber-500/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-center text-stone-400 py-20">Loading catalog...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-stone-400 py-20">No materials found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
