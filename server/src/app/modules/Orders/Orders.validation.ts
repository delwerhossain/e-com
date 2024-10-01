import { z } from 'zod';
import { Types } from 'mongoose';

const addressSchema = z.object({
   street: z.string(),
   city: z.string(),
   state: z.string().optional(),
   postalCode: z.string(),
   country: z.string(),
});

const orderValidationSchema = z.object({
   userId: z.instanceof(Types.ObjectId),                // Mongoose ObjectId
   productId: z.instanceof(Types.ObjectId),             // Mongoose ObjectId
   quantity: z.number().min(1),                         // Must be at least 1
   totalAmount: z.number().min(0),                      // Non-negative total amount
   taxAmount: z.number().min(0).optional(),             // Optional non-negative tax amount
   discountAmount: z.number().min(0).optional(),        // Optional non-negative discount amount
   shippingAddress: addressSchema,                      // Nested Address validation
   billingAddress: addressSchema,                       // Nested Address validation
   paymentStatus: z.enum(['pending', 'completed', 'failed']).optional(),
   isPaid: z.boolean(),                                 // Boolean for payment status
   paymentMethod: z.string().optional(),                // Optional string for payment method
   orderStatus: z.enum(['processing', 'shipped', 'delivered', 'cancelled']).optional(),
   shippingMethod: z.string().optional(),               // Optional string for shipping method
   trackingNumber: z.string().optional(),               // Optional tracking number
   notes: z.string().optional(),                        // Optional string for special notes
   isGift: z.boolean().optional(),                      // Optional flag for gift orders
   estimatedDeliveryDate: z.string().optional(),        // Optional estimated delivery date
});


const addressUpdateSchema = z.object({
   street: z.string().optional(),
   city: z.string().optional(),
   state: z.string().optional(),
   postalCode: z.string().optional(),
   country: z.string().optional(),
});

const orderUpdateValidationSchema = z.object({
   userId: z.instanceof(Types.ObjectId).optional(),      // Optional Mongoose ObjectId
   productId: z.instanceof(Types.ObjectId).optional(),   // Optional Mongoose ObjectId
   quantity: z.number().min(1).optional(),               // Optional, must be at least 1 if provided
   totalAmount: z.number().min(0).optional(),            // Optional, non-negative
   taxAmount: z.number().min(0).optional(),              // Optional, non-negative
   discountAmount: z.number().min(0).optional(),         // Optional, non-negative
   shippingAddress: addressUpdateSchema.optional(),      // Optional nested Address validation
   billingAddress: addressUpdateSchema.optional(),       // Optional nested Address validation
   paymentStatus: z.enum(['pending', 'completed', 'failed']).optional(),
   isPaid: z.boolean().optional(),                       // Optional boolean
   paymentMethod: z.string().optional(),                 // Optional string
   orderStatus: z.enum(['processing', 'shipped', 'delivered', 'cancelled']).optional(),
   shippingMethod: z.string().optional(),                // Optional string
   trackingNumber: z.string().optional(),                // Optional string
   notes: z.string().optional(),                         // Optional string
   isGift: z.boolean().optional(),                       // Optional boolean
   estimatedDeliveryDate: z.string().optional(),         // Optional string
});

export const OrderValidtion = { orderUpdateValidationSchema, orderValidationSchema };










export { orderValidationSchema };
