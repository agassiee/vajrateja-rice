import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section style={{
        backgroundColor: 'var(--light-green)',
        padding: '80px 0',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container grid grid-cols-2 items-center" style={{ gap: '40px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ fontSize: '3.5rem', color: 'var(--primary-green)', marginBottom: '20px' }}>
              Premium Quality Rice Delivered to Your Doorstep
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '32px' }}>
              Experience the finest grains from Vajrateja Rice Ltd. Sourced from the best farms, processed with care.
            </p>
            <Link to="/products" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Explore Products <ArrowRight size={20} />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img 
              src="/images/frontpage.jpg.jpeg" 
              alt="Premium Rice" 
              style={{ borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-lg)', width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container" style={{ padding: '80px 20px' }}>
        <div className="grid grid-cols-3" style={{ textAlign: 'center', gap: '40px' }}>
          <div>
            <div style={{ color: 'var(--gold)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <ShieldCheck size={48} />
            </div>
            <h3 style={{ marginBottom: '8px' }}>Premium Quality</h3>
            <p style={{ color: 'var(--text-light)' }}>100% sortex clean and aged rice for perfect cooking.</p>
          </div>
          <div>
            <div style={{ color: 'var(--gold)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Truck size={48} />
            </div>
            <h3 style={{ marginBottom: '8px' }}>Fast Delivery</h3>
            <p style={{ color: 'var(--text-light)' }}>Direct from mill to your home without middle-men.</p>
          </div>
          <div>
            <div style={{ color: 'var(--gold)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Clock size={48} />
            </div>
            <h3 style={{ marginBottom: '8px' }}>24/7 Support</h3>
            <p style={{ color: 'var(--text-light)' }}>We are always here to help with your orders.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
