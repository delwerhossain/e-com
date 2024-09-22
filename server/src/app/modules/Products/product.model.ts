import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

// Product schema definition
const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product Name is required'],
      unique: true,
      trim: true,
    },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: false,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    images: { type: [String], required: true },
    color: { type: String }, // Optional color field
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isBestProduct: { type: Boolean, default: false },

    // Ratings embedded as a subdocument
    ratings: {
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      reviewsCount: { type: Number, default: 0 },
    },

    // Reviews field referencing the Review model
    reviews: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Reviews' }],
      default: [],
    },

    // Discount and pricing fields
    discountPercentage: { type: Number, default: 0 }, // Default discount 0%
    discountedPrice: { type: Number }, // Calculated discounted price

    // Stock management
    outOfStock: { type: Boolean, default: false }, // Out-of-stock flag
    restockDate: { type: String }, // Expected restock date

    // Delivery-related fields
    delivery: { type: String, enum: ['Free', 'Pay'], default: 'Pay' },
    deliveryCharge: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value: number) {
          // Only validate deliveryCharge when delivery is 'Pay'
          if (this.delivery === 'Pay' && (!value || value <= 0)) {
            return false;
          }
          return true;
        },
        message: 'Delivery charge is required when delivery is Pay',
      },
    },

    // Product weight for shipping calculations
    weight: { type: String },
    size: { type: String }, // Optional size field

    // Maximum order quantity
    maxOrderQuantity: { type: Number }, // Maximum order quantity allowed
  },
  { timestamps: true }, // Automatically handle createdAt and updatedAt
);

// 3. Create a Model
export const ProductModel = model<IProduct>('Product', productSchema);
