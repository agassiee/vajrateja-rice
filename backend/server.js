import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());

// CORS Config
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5174', // Default to local for dev
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-key'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// Database Connection & Tracking
const MONGODB_URI = process.env.MONGODB_URI;
let isDbReady = false;

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI is required.');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
    isDbReady = true;
  } catch (error) {
    console.error('Error connecting to MongoDB on startup:', error.message);
    process.exit(1); // Fail fast on startup
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected! Runtime operations may fail.');
  isDbReady = false;
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully.');
  isDbReady = true;
});

// Auto-retry connection quietly in background if it disconnects
setInterval(async () => {
  if (!isDbReady) {
    try { 
      await mongoose.connect(MONGODB_URI); 
      isDbReady = true;
      console.log('MongoDB recovered via background retry.');
    } catch (_) {}
  }
}, 5000);

await connectDB();

// DB Readiness Middleware
const requireDb = (req, res, next) => {
  if (!isDbReady) {
    return res.status(503).json({ success: false, message: 'Service Unavailable: Database is down.' });
  }
  next();
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    db: isDbReady ? 'up' : 'down',
    uptime: process.uptime()
  });
});

// Admin Login Route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true, token: process.env.ADMIN_API_KEY });
  }
  
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Routes
app.use('/api/orders', requireDb, orderRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
