import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB, { isDbReady } from './config/db.js';
import { seedAdminIfNeeded } from './services/dataService.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    business: 'Rao Stone Traders',
    database: isDbReady() ? 'connected' : 'mock',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  if (isDbReady()) {
    await seedAdminIfNeeded();
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Data source: ${isDbReady() ? 'MongoDB' : 'In-memory mock store'}`);
  });
};

start().catch((err) => {
  console.error('Startup error:', err.message);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (fallback mode)`);
  });
});
