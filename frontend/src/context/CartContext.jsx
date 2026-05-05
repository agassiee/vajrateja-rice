import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('vajrateja_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('vajrateja_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, bags: item.bags + 1 } 
            : item
        );
      }
      return [...prev, { ...product, bags: 1 }];
    });
  };

  const updateQuantity = (id, bags) => {
    if (bags < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, bags } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotals = cartItems.reduce((acc, item) => {
    return {
      totalBags: acc.totalBags + item.bags,
      totalWeight: acc.totalWeight + (item.weight * item.bags),
      totalPrice: acc.totalPrice + (item.price * item.bags)
    };
  }, { totalBags: 0, totalWeight: 0, totalPrice: 0 });

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotals
    }}>
      {children}
    </CartContext.Provider>
  );
};
