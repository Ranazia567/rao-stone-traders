import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('rst_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('rst_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, vehicleType = 'Dumper', quantity = 1) => {
    setItems((prev) => {
      const key = `${product._id}-${vehicleType}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { key, product, vehicleType, quantity }];
    });
  };

  const removeFromCart = (key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  };

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) {
      removeFromCart(key);
      return;
    }
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  const getItemPrice = (item) => {
    const unit =
      item.vehicleType === 'Dumper'
        ? item.product.pricePerDumper
        : item.product.pricePerTrolley;
    return unit * item.quantity;
  };

  const cartTotal = items.reduce((s, i) => s + getItemPrice(i), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        getItemPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
