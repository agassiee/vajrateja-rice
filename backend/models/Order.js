import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true }
  },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      bags: { type: Number, required: true },
      weight: { type: Number, required: true } // Weight in kg
    }
  ],
  totals: {
    totalBags: { type: Number, required: true },
    totalWeight: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  },
  deliveryDate: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'Delivered'],
    default: 'Pending'
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
