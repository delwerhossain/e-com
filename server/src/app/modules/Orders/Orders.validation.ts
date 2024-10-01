import { z } from 'zod';
import { Types } from 'mongoose';

// Zod schema for MongoDB ObjectId using refine
const objectIdSchema = z
   .string()
   .refine(val => Types.ObjectId.isValid(val), {
      message: 'Invalid ObjectId format',
   })
   .transform(val => new Types.ObjectId(val));

// Address schema
const addressSchema = z.object({
   street: z.string().nonempty('Street is required'),
   city: z.string().nonempty('City is required'),
   state: z.string().optional(),
   postalCode: z.string().nonempty('Postal code is required'),
   country: z.string().nonempty('Country is required'),
});

// Order validation schema
const orderValidationSchema = z.object({
   userId: objectIdSchema,
   productId: objectIdSchema,
   quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
   totalAmount: z.number().min(0, { message: 'Total amount must be non-negative' }),
   taxAmount: z.number().min(0, { message: 'Tax amount must be non-negative' }).optional(),
   discountAmount: z.number().min(0, { message: 'Discount amount must be non-negative' }).optional(),
   shippingAddress: addressSchema,
   billingAddress: addressSchema,
   paymentStatus: z.enum(['pending', 'completed', 'failed'], {
      errorMap: () => ({ message: 'Payment status must be one of: pending, completed, failed' })
   }).optional(),
   isPaid: z.boolean().refine(val => typeof val === 'boolean', { message: 'isPaid must be a boolean' }),
   paymentMethod: z.string().optional(),
   orderStatus: z.enum(['processing', 'shipped', 'delivered', 'cancelled'], {
      errorMap: () => ({ message: 'Order status must be one of: processing, shipped, delivered, cancelled' })
   }).optional(),
   transactionId: z.string().optional(),
   shippingMethod: z.string().optional(),
   trackingNumber: z.string().optional(),
   notes: z.string().optional(),
   isGift: z.boolean().optional(),
   estimatedDeliveryDate: z.string().optional(),
}).strict();

// Address update schema
const addressUpdateSchema = z.object({
   street: z.string().optional(),
   city: z.string().optional(),
   state: z.string().optional(),
   postalCode: z.string().optional(),
   country: z.string().optional(),
});

// Order update validation schema
const orderUpdateValidationSchema = z.object({
   userId: objectIdSchema.optional(),
   productId: objectIdSchema.optional(),
   quantity: z.number().min(1, { message: 'Quantity must be at least 1' }).optional(),
   totalAmount: z.number().min(0, { message: 'Total amount must be non-negative' }).optional(),
   taxAmount: z.number().min(0, { message: 'Tax amount must be non-negative' }).optional(),
   discountAmount: z.number().min(0, { message: 'Discount amount must be non-negative' }).optional(),
   shippingAddress: addressUpdateSchema.optional(),
   billingAddress: addressUpdateSchema.optional(),
   paymentStatus: z.enum(['pending', 'completed', 'failed'], {
      errorMap: () => ({ message: 'Payment status must be one of: pending, completed, failed' })
   }).optional(),
   isPaid: z.boolean().optional(),
   paymentMethod: z.string().optional(),
   orderStatus: z.enum(['processing', 'shipped', 'delivered', 'cancelled'], {
      errorMap: () => ({ message: 'Order status must be one of: processing, shipped, delivered, cancelled' })
   }).optional(),
   shippingMethod: z.string().optional(),
   trackingNumber: z.string().optional(),
   notes: z.string().optional(),
   isGift: z.boolean().optional(),
   estimatedDeliveryDate: z.string().optional(),
}).strict();

export const OrderValidation = { orderUpdateValidationSchema, orderValidationSchema };
