import mongoose, { Document, Schema } from 'mongoose';

export interface IReview {
  user: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'gold' | 'silver' | 'artificial';
  subcategory: 'necklace' | 'earrings' | 'rings' | 'bangles' | 'anklets' | 'bracelet' | 'pendant' | 'set';
  images: string[];
  stock: number;
  weight?: string;
  material?: string;
  occasion: string[];
  isFeatured: boolean;
  ratings: number;
  numReviews: number;
  reviews: IReview[];
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['gold', 'silver', 'artificial'],
        message: 'Category must be gold, silver, or artificial',
      },
    },
    subcategory: {
      type: String,
      required: [true, 'Subcategory is required'],
      enum: {
        values: ['necklace', 'earrings', 'rings', 'bangles', 'anklets', 'bracelet', 'pendant', 'set'],
        message: 'Invalid subcategory',
      },
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Product must have at least one image',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    weight: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    occasion: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviews: [ReviewSchema],
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ ratings: -1 });

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
