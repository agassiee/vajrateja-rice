# Vajrateja Rice Ltd - Full-Stack E-commerce System

A production-ready e-commerce platform for Vajrateja Rice Ltd, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Customer Facing:**
  - Modern, responsive UI with animations (Framer Motion)
  - Shopping Cart functionality with persistent context
  - Checkout form for cash-on-delivery orders
- **Admin Dashboard:**
  - Secure, API Key protected backend routes
  - Real-time polling for new orders (plays audio notification)
  - Toggle order statuses (Pending -> Delivered)
  - Set and update exact Delivery Dates
- **Email Notifications:**
  - Automatic email to owner when new orders are placed
  - Automatic email to customer when their delivery date is scheduled

## 🚀 Deployment Plan

### 1. Backend → Render (or Heroku)
1. Push your code to GitHub.
2. Create a new Web Service on Render and connect your repository (set Root Directory to `backend` if deploying a monorepo, or push `backend` as its own repo).
3. Set the build command to `npm install` and start command to `node server.js`.
4. Add the following Environment Variables in Render:
   - `MONGODB_URI`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `OWNER_EMAIL`
   - `ADMIN_API_KEY`
   - `CLIENT_URL` (Optional, depending on CORS setup)
5. Deploy and copy your backend URL (e.g., `https://vajrateja-backend.onrender.com`).

### 2. Frontend → Netlify
1. In your `frontend` directory, ensure `.env` has the backend URL:
   ```
   VITE_API_BASE_URL=https://vajrateja-backend.onrender.com
   VITE_ADMIN_API_KEY=your_secure_admin_api_key_here
   ```
2. Build the project locally (or connect to Netlify via GitHub):
   ```bash
   npm run build
   ```
3. Upload the resulting `dist/` folder manually to Netlify Drop, or configure Netlify to build automatically from GitHub (Build command: `npm run build`, Publish directory: `dist`).

---
