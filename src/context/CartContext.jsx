import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('sesa_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('sesa_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id || item.title === product.title);
      if (existing) {
        return prev.map((item) => 
          (item.id === product.id || item.title === product.title) ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    alert(`${product.title} ditambahkan ke keranjang!`);
  };

  const removeFromCart = (title) => {
    setCart((prev) => prev.filter((item) => item.title !== title));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};