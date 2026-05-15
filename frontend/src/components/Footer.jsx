import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--primary-green)', color: 'var(--white)', padding: '40px 20px', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        
        {/* Company Outlet Details */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--gold)' }}>Company Outlet</h3>
          <h4 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>VAJRATEJA RICE WORLD</h4>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#e0e0e0', lineHeight: '1.6' }}>
            <MapPin size={20} style={{ flexShrink: 0, marginTop: '4px', color: 'var(--gold)' }} />
            <p>
              Shop No.: 3 & 4. Plot No. : 39/A.<br/>
              Opposite: S.R.Digi School, Sushma Sai Nagar,<br/>
              Vanastalipuram - 500 070.<br/>
              Hyderabad. Telangana State. India.
            </p>
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--gold)' }}>Contact Us</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#e0e0e0' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Phone size={20} style={{ color: 'var(--gold)' }} />
              <div>
                <strong>Customer Care:</strong><br/>
                +91 97058 08532
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Phone size={20} style={{ color: 'var(--gold)' }} />
              <div>
                <strong>Further Details:</strong><br/>
                9666 228 532, 8179 220 973
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Mail size={20} style={{ color: 'var(--gold)' }} />
              <div>
                <strong>Email:</strong><br/>
                <a href="mailto:Lakshmivajrateja@gmail.com" style={{ color: '#e0e0e0', textDecoration: 'none' }}>Lakshmivajrateja@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#b0b0b0', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} Vajrateja Rice Ltd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
