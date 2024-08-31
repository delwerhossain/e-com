import { Schema, model } from 'mongoose';
import { Tcategory } from './categories.interface';

// category schema
const categorySchema = new Schema<Tcategory>({
    name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },

}, { timestamps: true });


// category Model
export const categoryModel = model<Tcategory>('categorie', categorySchema);