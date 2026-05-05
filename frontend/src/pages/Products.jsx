import React from 'react';
import { motion } from 'framer-motion';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Products = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <div className="container fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-green)', marginBottom: '16px' }}>Our Products</h1>
        <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
          Select from our range of premium rice. Each bag is carefully packed to preserve freshness and aroma.
        </p>
      </div>

      <div className="grid grid-cols-3">
        {products.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--border-radius)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition)'
            }}
            whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
          >
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '20px' }}>
              <span style={{ 
                display: 'inline-block', 
                padding: '4px 8px', 
                backgroundColor: 'var(--light-green)', 
                color: 'var(--primary-green)',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {product.category}
              </span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{product.name}</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '16px', minHeight: '40px' }}>
                {product.description}
              </p>
              
              <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                    ₹{product.price}
                  </span>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}> / {product.weight}kg bag</span>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Products;
