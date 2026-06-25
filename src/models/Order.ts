import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: 'cod';
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  name: {
    type: String,
    required: [true, 'Recipient name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    trim: true,
    match: [/^[1-9][0-9]{5}$/, 'Please provide a valid 6-digit pincode'],
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => v.length > 0,
        message: 'Order must have at least one item',
      },
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cod'],
      default: 'cod',
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    orderNotes: {
      type: String,
      trim: true,
      maxlength: [500, 'Order notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
