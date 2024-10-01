import { model, Schema } from 'mongoose';

// Address Schema
const addressSchema = new Schema({
   street: { type: String, required: [true, 'Street address is required'] },
   city: { type: String, required: [true, 'City is required'] },
   state: { type: String },
   postalCode: { type: String, required: [true, 'Postal code is required'] },
   country: { type: String, required: [true, 'Country is required'] },
});

// Order Schema
const orderSchema = new Schema({
   userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
   },
   productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required']
   },
   quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
   },
   totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
   },
   taxAmount: {
      type: Number,
      min: [0, 'Tax amount cannot be negative'],
      default: 0
   },
   discountAmount: {
      type: Number,
      min: [0, 'Discount amount cannot be negative'],
      default: 0
   },
   shippingAddress: {
      type: addressSchema,
      required: [true, 'Shipping address is required']
   },
   billingAddress: {
      type: addressSchema,
      required: [true, 'Billing address is required']
   },
   paymentStatus: {
      type: String,
      enum: {
         values: ['pending', 'completed', 'failed'],
         message: 'Payment status must be either pending, completed, or failed',
      },
      default: 'pending'
   },
   isPaid: {
      type: Boolean,
      required: [true, 'Payment status (isPaid) is required']
   },
   paymentMethod: {
      type: String,
      enum: {
         values: ['credit card', 'paypal', 'bank transfer', 'cash on delivery'],
         message: 'Payment method must be one of the following: credit card, paypal, bank transfer, or cash on delivery',
      },
      default: 'cash on delivery'
   },
   orderStatus: {
      type: String,
      enum: {
         values: ['processing', 'shipped', 'delivered', 'cancelled'],
         message: 'Order status must be either processing, shipped, delivered, or cancelled',
      },
      default: 'processing'
   },
   transactionId: {
      type: String
   },
   shippingMethod: {
      type: String
   },
   trackingNumber: {
      type: String
   },
   notes: {
      type: String
   },
   isGift: {
      type: Boolean,
      default: false
   },
   estimatedDeliveryDate: {
      type: String
   },
}, {
   timestamps: true
});

export const OrdersModel = model('Order', orderSchema);
