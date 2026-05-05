import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || 'VRL-XXXXXX';

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          backgroundColor: 'var(--white)',
          padding: '60px 40px',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          maxWidth: '500px'
        }}
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          style={{ display: 'inline-block', marginBottom: '24px' }}
        >
          <CheckCircle size={80} color="var(--primary-green)" />
        </motion.div>
        
        <h1 style={{ marginBottom: '16px', color: 'var(--primary-green)' }}>Order Placed Successfully!</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '8px' }}>
          Thank you for choosing Vajrateja Rice Ltd.
        </p>
        <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>
          Your order ID is <strong>{orderId}</strong>
        </p>

        <div style={{ backgroundColor: 'var(--light-green)', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--secondary-green)' }}>
            We have sent a notification to our team and they will contact you shortly regarding the delivery.
          </p>
        </div>

        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default Success;
