import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB, { isDbReady } from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const products = [
  {
    title: 'Awwal Red Bricks & Roof Tiles',
    category: 'Building Structure',
    pricePerDumper: 45000,
    pricePerTrolley: 8000,
    image: 'https://marketdeals.pk/wp-content/uploads/2021/02/Awwal-Bricks-A-Class.jpg',
    description: 'First-grade Awwal red clay bricks and roof tiles for structural construction.',
    iconKey: 'Grid',
    theme: 'red',
    tag: 'Building Structure',
    qualityLabel: 'Awwal First Grade',
    stockCount: 190,
    inStock: true,
  },
  {
    title: 'Water Bound Macadam (WBM Road Base)',
    category: 'Road Construction',
    pricePerDumper: 32000,
    pricePerTrolley: 5800,
    image: 'https://materialprovider.com/wp-content/uploads/2025/09/ec4043eb-78a3-4e8f-b8f6-27e57a147baf.jpg',
    description: 'Coarse road-base aggregate mix for sub-base highway compaction.',
    iconKey: 'Truck',
    theme: 'emerald',
    tag: 'Road Construction',
    qualityLabel: 'Highway WBM Spec',
    stockCount: 210,
    inStock: true,
  },
  {
    title: 'Washed Clean Gravel (Saf Bajri)',
    category: 'Filtered Aggregate',
    pricePerDumper: 42000,
    pricePerTrolley: 7200,
    image: 'https://bayridgelandscaping.com/wp-content/uploads/2025/03/ChatGPT-Image-Mar-26-2025-12_52_47-PM.png',
    description: 'Triple-washed clean gravel free from dust and soil impurities.',
    iconKey: 'Droplets',
    theme: 'blue',
    tag: 'Filtered Aggregate',
    qualityLabel: 'Premium Washed Grade',
    stockCount: 280,
    inStock: true,
  },
  {
    title: 'Chenab River Sand (Rait)',
    category: 'Masonry & Plaster',
    pricePerDumper: 24000,
    pricePerTrolley: 4500,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2nS97k5cTGl0ukg8cCfYqvVchUiIZAEE3q-rLPm_EMg&s=10',
    description: 'Clean fine-grain Chenab river sand ideal for plaster and masonry.',
    iconKey: 'Sparkles',
    theme: 'orange',
    tag: 'Masonry & Plaster',
    qualityLabel: 'Chenab River Grade',
    stockCount: 560,
    inStock: true,
  },
  {
    title: 'Stone Dust / Sub-base Khak',
    category: 'Block Filling & Sub-base',
    pricePerDumper: 20000,
    pricePerTrolley: 3800,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwMc1-KdAbMUWj28p_eH9Pm38yDIrXAOEc32xSOIYqLQ&s=10',
    description: 'Fine crushed stone dust for floor base compaction and paver filling.',
    iconKey: 'Feather',
    theme: 'slate',
    tag: 'Block Filling',
    qualityLabel: 'Compacted Fill Grade',
    stockCount: 350,
    inStock: true,
  },
  {
    title: 'Sargodha Bajri (1/2" & 3/4" Crush)',
    category: 'Roofing & Concrete Slabs',
    pricePerDumper: 38000,
    pricePerTrolley: 6500,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrGi4Me45jTRW-lmgOqW-bBWUxynjCu5n0SjNrWA52yA&s=10',
    description: 'High-density crushed stone aggregate for reinforced concrete slabs.',
    iconKey: 'Layers',
    theme: 'amber',
    tag: 'Roofing & Slabs',
    qualityLabel: 'Grade-A Sargodha Stone',
    stockCount: 420,
    inStock: true,
  },
];

const seed = async () => {
  await connectDB();

  if (!isDbReady()) {
    console.log('MongoDB connection could not be established. Seed aborted.');
    process.exit(0);
  }

  await Product.deleteMany({});
  await Product.insertMany(products);

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = await User.findOne({ username });

  if (!existing) {
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed, role: 'admin' });
    console.log(`Admin user created: ${username}`);
  }

  console.log(`Seeded ${products.length} products successfully`);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
