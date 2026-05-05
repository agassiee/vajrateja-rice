import dotenv from 'dotenv';
dotenv.config();

export const requireAdmin = (req, res, next) => {
  const apiKey = req.headers['x-admin-key'];
  const validKey = process.env.ADMIN_API_KEY;

  if (!validKey) {
    console.error('CRITICAL: ADMIN_API_KEY is not set in backend environment variables.');
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  if (!apiKey || apiKey !== validKey) {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid or missing API key' });
  }

  next();
};
