
import { model, Schema, Types } from 'mongoose';

// Address Schema
const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

// Order Schema
const orderSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  productId: { type: Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  taxAmount: { type: Number },
  discountAmount: { type: Number },
  shippingAddress: { type: addressSchema, required: true },
  billingAddress: { type: addressSchema, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  isPaid: { type: Boolean, required: true },
  paymentMethod: { type: String },
  orderStatus: { 
    type: String, 
    enum: ['processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'processing' 
  },
  shippingMethod: { type: String },
  trackingNumber: { type: String },
  notes: { type: String },
  isGift: { type: Boolean, default: false },
  estimatedDeliveryDate: { type: String },
}, {
  timestamps: true
});

export const OrdersModel =model('Order', orderSchema);