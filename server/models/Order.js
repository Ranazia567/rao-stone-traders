import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    material: { type: String, required: true },
    vehicleType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Dispatched', 'Delivered'],
      default: 'Pending',
    },
    freightCharge: { type: Number, default: 0 },
    items: [
      {
        productId: String,
        title: String,
        vehicleType: String,
        quantity: Number,
        unitPrice: Number,
        subtotal: Number,
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
