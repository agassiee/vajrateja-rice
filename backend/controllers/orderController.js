import Order from '../models/Order.js';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

// Config nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  connectionTimeout: 10000
});

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { customer, items, totals } = req.body;
    
    // Generate order ID (ORD-YYYY-NNNN)
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${year}-${randomNum}`;
    
    const order = new Order({
      orderId,
      customer,
      items,
      totals,
      status: 'Pending'
    });

    await order.save();

    // Send email notification asynchronously, non-blocking
    setImmediate(() => sendOrderEmail(order).catch(console.error));

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server error while creating order' });
  }
};

// Get all orders (Admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error while fetching orders' });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveryDate } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    
    if (deliveryDate) {
      const parsedDate = new Date(deliveryDate);
      
      // Normalize to start of day (UTC to prevent timezone shift issues across midnight)
      parsedDate.setUTCHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      
      // Must be a valid date, strictly in the future (no past, no today)
      if (isNaN(parsedDate.getTime()) || parsedDate <= today) {
        return res.status(400).json({ success: false, message: 'Invalid delivery date. Must be a valid future date (not today or past).' });
      }
      updateData.deliveryDate = parsedDate;
    }
    
    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    if (deliveryDate && order.customer.email) {
      setImmediate(() => sendDeliveryDateEmail(order).catch(console.error));
    }
    
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Server error while updating order' });
  }
};

// Helper to send email
async function sendOrderEmail(order) {
  if (!process.env.SMTP_USER) {
    console.log('Skipping email notification, no SMTP credentials provided.');
    return;
  }

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.bags} bags</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.weight} kg</td>
      <td style="padding: 8px; border: 1px solid #ddd;">₹${item.price}</td>
    </tr>
  `).join('');

  const html = `
    <h2>New Order Placed: ${order.orderId}</h2>
    <h3>Customer Details</h3>
    <p><strong>Name:</strong> ${order.customer.name}</p>
    <p><strong>Phone:</strong> ${order.customer.phone}</p>
    <p><strong>Email:</strong> ${order.customer.email || 'N/A'}</p>
    <p><strong>Address:</strong> ${order.customer.address}</p>

    <h3>Order Summary</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;">Product</th>
          <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;">Bags</th>
          <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;">Weight</th>
          <th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <th colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Bags:</th>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${order.totals.totalBags}</td>
        </tr>
        <tr>
          <th colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Weight:</th>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${order.totals.totalWeight} kg</td>
        </tr>
        <tr>
          <th colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Price:</th>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">₹${order.totals.totalPrice}</td>
        </tr>
      </tfoot>
    </table>
  `;

  await transporter.sendMail({
    from: '"Vajrateja Rice Ltd" <noreply@vajrateja.com>',
    to: process.env.OWNER_EMAIL || process.env.SMTP_USER,
    subject: `New Order Received - ${order.orderId}`,
    html: html
  });
}

// Helper to send delivery date email
async function sendDeliveryDateEmail(order) {
  if (!process.env.SMTP_USER || !order.customer.email) {
    return;
  }

  const deliveryDateFormatted = new Date(order.deliveryDate).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const html = `
    <h2>Your Order Update - ${order.orderId}</h2>
    <p>Dear ${order.customer.name},</p>
    <p>We are pleased to inform you that your order will be delivered on <strong>${deliveryDateFormatted}</strong>.</p>
    <p>Thank you for choosing Vajrateja Rice Ltd.</p>
    <br/>
    <p>Best Regards,</p>
    <p>Vajrateja Rice Ltd</p>
  `;

  await transporter.sendMail({
    from: '"Vajrateja Rice Ltd" <noreply@vajrateja.com>',
    to: order.customer.email,
    subject: `Order Delivery Scheduled - ${order.orderId}`,
    html: html
  });
}
