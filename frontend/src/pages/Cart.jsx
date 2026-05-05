import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotals } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container fade-in flex flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" 
          alt="Empty Cart" 
          style={{ width: '200px', opacity: 0.5, marginBottom: '24px' }} 
        />
        <h2 style={{ color: 'var(--text-light)', marginBottom: '16px' }}>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-green)', marginBottom: '32px' }}>Shopping Cart</h1>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Cart Items */}
        <div className="flex flex-col gap-4">
          {cartItems.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                display: 'flex',
                gap: '20px',
                padding: '20px',
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div style={{ flex: 1 }}>
                <div className="flex justify-between">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: 'red' }}>
                    <Trash2 size={20} />
                  </button>
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '12px' }}>
                  {item.weight} kg bag | ₹{item.price} each
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4" style={{ backgroundColor: 'var(--light-gray)', padding: '4px', borderRadius: '8px' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.bags - 1)}
                      style={{ padding: '4px' }}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.bags}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.bags + 1)}
                      style={{ padding: '4px' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary-green)' }}>
                    ₹{item.price * item.bags}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{
          backgroundColor: 'var(--white)',
          padding: '24px',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-md)',
          height: 'fit-content',
          position: 'sticky',
          top: '100px'
        }}>
          <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Order Summary</h2>
          
          <div className="flex flex-col gap-4" style={{ marginBottom: '24px' }}>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-light)' }}>Total Bags</span>
              <span style={{ fontWeight: 'bold' }}>{cartTotals.totalBags}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-light)' }}>Total Weight</span>
              <span style={{ fontWeight: 'bold' }}>{cartTotals.totalWeight} kg</span>
            </div>
            <div style={{ borderTop: '1px solid var(--gray)', margin: '8px 0' }}></div>
            <div className="flex justify-between items-center">
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Amount</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                ₹{cartTotals.totalPrice}
              </span>
            </div>
          </div>

          <Link to="/checkout" className="btn btn-gold" style={{ width: '100%', padding: '16px' }}>
            Proceed to Checkout <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
