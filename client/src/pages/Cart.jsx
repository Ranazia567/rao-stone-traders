import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Truck,
  Package,
  ArrowRight,
  Minus,
  Plus,
  Layers,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../utils/api';
import ProductVisual from '../components/ProductVisual';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, cartTotal, itemCount, getItemPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-16 h-16 text-stone-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-stone-100 mb-2">Your cart is empty</h2>
        <p className="text-stone-400 mb-6">Browse the stone catalog to add materials.</p>
        <Link to="/shop" className="btn-primary">
          <Layers className="w-4 h-4" />
          Stone Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-2">
        <ShoppingCart className="w-7 h-7 text-amber-500" />
        <h1 className="text-3xl font-bold text-stone-100">Shopping Cart</h1>
      </div>
      <p className="text-stone-400 mb-8 ml-10">{itemCount} item(s)</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.key} className="card p-4 flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-36 shrink-0 rounded-lg overflow-hidden">
                <ProductVisual product={item.product} compact showDetailLink={false} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-stone-100">{item.product.title}</h3>
                <span className="inline-flex items-center gap-1 text-xs text-stone-500 mt-1">
                  {item.vehicleType === 'Dumper' ? <Truck className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                  {item.vehicleType}
                </span>
              </div>
              <div className="flex flex-col items-end justify-between gap-2">
                <button onClick={() => removeFromCart(item.key)} className="text-red-400 hover:text-red-300 active:scale-90">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="p-1 bg-stone-600/40 rounded active:scale-90">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="p-1 bg-stone-600/40 rounded active:scale-90">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-bold text-amber-500">{formatPKR(getItemPrice(item))}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit sticky top-28">
          <h2 className="font-bold text-stone-100 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-500" />
            Order Summary
          </h2>
          <div className="space-y-2 mb-4 text-sm">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between text-stone-400">
                <span className="truncate mr-2">{item.product.title} x{item.quantity}</span>
                <span className="text-stone-200 whitespace-nowrap">{formatPKR(getItemPrice(item))}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-600/60 pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal</span>
              <span className="text-amber-500">{formatPKR(cartTotal)}</span>
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              Freight calculated at checkout
            </p>
          </div>
          <Link to="/checkout" className="btn-primary w-full active:scale-95">
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
