import { Types } from 'mongoose';

interface IAddress {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed'
}

enum OrderStatus {
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled'
}

export interface IOrder {
  userId: Types.ObjectId;            // Reference to the user
  productId: Types.ObjectId;         // Reference to the product
  quantity: number;                  // Quantity of the product purchased
  totalAmount: number;               // Total cost of the order
  taxAmount?: number;                // Tax amount applied to the order
  discountAmount?: number;           // Any discount applied to the order
  shippingAddress: IAddress;         // Shipping address
  billingAddress: IAddress;          // Billing address
  paymentStatus?: PaymentStatus;     // Payment status (pending, completed, failed)
  isPaid: boolean;                   // Flag to indicate if the order is paid
  paymentMethod?: string;            // Payment method used
  orderStatus?: OrderStatus;          // Order status (processing, shipped, delivered, cancelled)
  shippingMethod?: string;           // Shipping method used
  trackingNumber?: string;           // Shipping tracking number
  notes?: string;                    // Any special notes or instructions
  isGift?: boolean;                  // Is the order marked as a gift                 
  estimatedDeliveryDate?: string;    // Estimated delivery date for the order
}
