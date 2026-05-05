import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, cartTotals, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.submitter?.blur(); // Prevent focus issues
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload = {
        customer: formData,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          bags: item.bags,
          weight: item.weight * item.bags
        })),
        totals: cartTotals
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (data.success) {
        clearCart();
        navigate('/success', { state: { orderId: data.order.orderId } });
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Server error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container fade-in" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-green)', marginBottom: '32px' }}>Checkout</h1>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'var(--white)',
        padding: '32px',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h2 style={{ marginBottom: '24px' }}>Delivery Details</h2>
        
        <div className="grid grid-cols-2" style={{ gap: '24px', marginBottom: '24px' }}>
          <div className="flex-col gap-2">
            <label style={{ fontWeight: 500 }}>Full Name *</label>
            <input 
              required
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--gray)', width: '100%' }} 
            />
          </div>
          <div className="flex-col gap-2">
            <label style={{ fontWeight: 500 }}>Phone Number *</label>
            <input 
              required
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--gray)', width: '100%' }} 
            />
          </div>
        </div>

        <div className="flex-col gap-2" style={{ marginBottom: '24px' }}>
          <label style={{ fontWeight: 500 }}>Email Address (Optional for tracking)</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--gray)', width: '100%' }} 
          />
        </div>

        <div className="flex-col gap-2" style={{ marginBottom: '32px' }}>
          <label style={{ fontWeight: 500 }}>Full Delivery Address *</label>
          <textarea 
            required
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="4"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--gray)', width: '100%', resize: 'vertical' }} 
          ></textarea>
        </div>

        <div style={{ backgroundColor: 'var(--light-gray)', padding: '24px', borderRadius: '8px', marginBottom: '32px' }}>
          <div className="flex justify-between items-center">
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Amount to Pay</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
              ₹{cartTotals.totalPrice}
            </span>
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '8px' }}>
            Payment method: Cash on Delivery
          </p>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ width: '100%', padding: '16px', fontSize: '1.2rem' }}
        >
          {loading ? 'Processing Order...' : 'Place Order Now'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
