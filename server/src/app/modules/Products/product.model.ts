import { Schema, model, Types } from 'mongoose';
import { IProduct} from './product.interface';

const productSchema = new Schema<IProduct>({
    name: { type: String, required: [true, "Product Name is required"], unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    subCategoryId: { type: Types.ObjectId, ref: 'SubCategory', required: false },
    images: { type: [String], required: true },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isBestProduct: { type: Boolean, default: false },
    ratings: {
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        reviewsCount: { type: Number, default: 0 }
    }
}, { timestamps: true });

// 3. Create a Model.
export const ProductModel = model<IProduct>('Product', productSchema);


