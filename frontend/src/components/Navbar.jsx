import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Wheat } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartTotals } = useCart();

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'var(--white)',
      boxShadow: 'var(--shadow-sm)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--primary-green)' }}>
          <Wheat size={32} />
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Vajrateja Rice</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/products" style={{ fontWeight: 500 }}>Shop</Link>
          
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <ShoppingCart size={24} />
            {cartTotals.totalBags > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: 'var(--gold)',
                color: 'var(--white)',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                {cartTotals.totalBags}
              </span>
            )}
          </Link>


        </div>
      </div>
    </nav>
  );
};

export default Navbar;
