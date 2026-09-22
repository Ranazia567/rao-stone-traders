import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    pricePerDumper: { type: Number, required: true, min: 0 },
    pricePerTrolley: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    description: { type: String, required: true },
    iconKey: { type: String, default: 'Layers' },
    theme: { type: String, default: 'amber' },
    tag: { type: String, default: '' },
    qualityLabel: { type: String, default: 'Grade-A Material' },
    stockCount: { type: Number, default: 100 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
