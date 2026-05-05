import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { LogOut } from 'lucide-react';

const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = 880; // A5
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
  } catch (e) {
    console.error('Audio play failed', e);
  }
};

const OrderRow = ({ order, fetchOrders }) => {
  const [status, setStatus] = useState(order.status || 'Pending');

  const getInitialDate = () => {
    if (!order.deliveryDate) return '';
    try {
      const d = new Date(order.deliveryDate);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const [deliveryDate, setDeliveryDate] = useState(getInitialDate());
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const apiKey = sessionStorage.getItem('adminToken') || '';
      const payload = { status };
      if (deliveryDate) {
        payload.deliveryDate = deliveryDate;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': apiKey
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Order ${order.orderId || 'Updated'} updated!`);
        fetchOrders();
      } else {
        toast.error(data.message || 'Failed to update order');
      }
    } catch (error) {
      toast.error('Network error while updating order');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr style={{ 
      borderBottom: '1px solid var(--gray)', 
      backgroundColor: order.isNew ? '#e8f5e9' : 'transparent',
      transition: 'background-color 2s ease-out'
    }}>
      <td style={{ padding: '16px', verticalAlign: 'top' }}>
        <strong>{order.orderId || 'Unknown'}</strong>
        {order.isNew && <span style={{ marginLeft: '8px', color: 'red', fontSize: '0.8rem', fontWeight: 'bold' }}>NEW</span>}
        <br />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''} {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : ''}
        </span>
      </td>
      <td style={{ padding: '16px', verticalAlign: 'top' }}>
        <strong>{order.customer?.name || 'Unknown'}</strong><br/>
        {order.customer?.phone || 'N/A'}<br/>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
          {order.customer?.address || 'N/A'}
        </span>
      </td>
      <td style={{ padding: '16px', verticalAlign: 'top' }}>
        <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
          {(order.items || []).map((item, idx) => (
            <div key={idx}>{item.bags}x {item.name || 'Product'}</div>
          ))}
        </div>
        <strong>Total: ₹{order.totals?.totalPrice || 0} ({order.totals?.totalWeight || 0}kg)</strong>
      </td>
      <td style={{ padding: '16px', verticalAlign: 'top' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            style={{ 
              padding: '6px', 
              borderRadius: '4px', 
              border: `1px solid ${status === 'Delivered' ? 'var(--primary-green)' : '#856404'}`,
              backgroundColor: status === 'Delivered' ? 'var(--light-green)' : '#fff3cd',
              color: status === 'Delivered' ? 'var(--primary-green)' : '#856404',
              fontWeight: 'bold',
              outline: 'none'
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
          </select>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
              {deliveryDate 
                ? `Delivery Scheduled: ${new Date(deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` 
                : 'Set Delivery Date:'}
            </label>
            <input 
              type="date" 
              value={deliveryDate} 
              onChange={(e) => setDeliveryDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--gray)', outline: 'none' }}
            />
          </div>
        </div>
      </td>
      <td style={{ padding: '16px', verticalAlign: 'top' }}>
        <button 
          className="btn btn-primary" 
          style={{ padding: '8px 16px', fontSize: '0.9rem', width: '100%' }}
          onClick={handleUpdate}
          disabled={isUpdating || (status === (order.status || 'Pending') && deliveryDate === getInitialDate())}
        >
          {isUpdating ? 'Saving...' : 'Update'}
        </button>
      </td>
    </tr>
  );
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const knownOrderIds = useRef(new Set());
  const initialLoadDone = useRef(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        toast.success('Login successful');
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Network error during login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setOrders([]);
    toast.success('Logged out');
  };

  const fetchOrders = async (isPolling = false) => {
    if (!isAuthenticated) return;
    try {
      const apiKey = sessionStorage.getItem('adminToken') || '';
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/orders`, {
        headers: { 'x-admin-key': apiKey }
      });
      const data = await response.json();
      
      if (response.status === 403) {
        if (!isPolling) toast.error('Session expired or invalid.');
        handleLogout();
        return;
      }

      if (data.success) {
        let hasNewOrders = false;
        
        const markedOrders = data.orders.map(order => {
          const isNew = initialLoadDone.current && !knownOrderIds.current.has(order._id);
          if (isNew) hasNewOrders = true;
          knownOrderIds.current.add(order._id);
          return { ...order, isNew };
        });

        if (hasNewOrders) {
          playNotificationSound();
          toast.success('New order received!');
        }

        setOrders(markedOrders);
        
        if (hasNewOrders) {
          setTimeout(() => {
            setOrders(currentOrders => currentOrders.map(o => ({ ...o, isNew: false })));
          }, 5000);
        }
      }
    } catch (error) {
      if (!isPolling) toast.error('Failed to load orders. Ensure backend is running.');
    } finally {
      setLoading(false);
      initialLoadDone.current = true;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchOrders();
      const interval = setInterval(() => fetchOrders(true), 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container fade-in" style={{ padding: '80px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'var(--white)', padding: '40px', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ color: 'var(--primary-green)', textAlign: 'center', marginBottom: '24px' }}>Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>User ID</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--gray)', outline: 'none' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--gray)', outline: 'none' }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '8px' }} disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>Loading orders...</div>;
  }

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-green)', marginBottom: '8px' }}>Admin Dashboard</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', fontWeight: 'bold' }}>
            Total Orders Received: <span style={{ color: 'var(--primary-green)' }}>{orders.length}</span>
          </p>
        </div>
        <button onClick={handleLogout} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f44336', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--light-gray)', borderBottom: '2px solid var(--gray)' }}>
              <th style={{ padding: '16px' }}>Order ID / Date</th>
              <th style={{ padding: '16px' }}>Customer Info</th>
              <th style={{ padding: '16px' }}>Order Summary</th>
              <th style={{ padding: '16px' }}>Status & Delivery</th>
              <th style={{ padding: '16px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-light)' }}>
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderRow key={order._id} order={order} fetchOrders={() => fetchOrders(true)} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
