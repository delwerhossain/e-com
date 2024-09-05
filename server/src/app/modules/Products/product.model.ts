import { Schema, model, Types } from 'mongoose';
import { IProduct, TReviews } from './product.interface';

const reviewsSchema = new Schema<TReviews>({
    reviewer: { type: String, required: false, trim: true },
    rating: { type: Number, required: false, min: 0, max: 5 },
    comment: { type: String, required: false, trim: true }
});

const productSchema = new Schema<IProduct>({
    name: { type: String, required: [true, "Product Name is required"], unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    subCategoryId: { type: Types.ObjectId, ref: 'SubCategory', required: false },
    images: { type: [String], required: true },
    ratings: {
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        reviewsCount: { type: Number, default: 0 },
        reviews: [reviewsSchema]
    }
}, { timestamps: true });

// 3. Create a Model.
export const ProductModel = model<IProduct>('Product', productSchema);


