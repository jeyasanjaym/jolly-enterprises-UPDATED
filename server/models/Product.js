import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'T-Shirt',
      'Pant/Track',
      'Co-Ord Set',
      'Shirt',
      'Hoodies',
      'Shoes',
      'Slipper',
      'Perfume',
    ],
  },
  subcategory: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  images: [{
    type: String,
  }],
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12'],
  }],
  colors: [{
    type: String,
  }],
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  newArrival: {
    type: Boolean,
    default: false,
  },
  backInStock: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Calculate discount percentage
productSchema.pre('save', function(next) {
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;

