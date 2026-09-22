import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  calculateQuote,
  calculateFreight,
  PUNJAB_CITIES,
} from '../services/dataService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.inStock === 'true') filter.inStock = true;
    const products = await getAllProducts(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/cities', (req, res) => {
  res.json(PUNJAB_CITIES);
});

router.post('/quote', async (req, res) => {
  try {
    const { productId, vehicleType, quantity, city } = req.body;
    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const quote = calculateQuote(product, vehicleType, quantity, city);

    if (quote.error) {
      return res.status(400).json({ message: quote.error });
    }

    res.json({ product: { _id: product._id, title: product.title }, ...quote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/freight', (req, res) => {
  try {
    const { city, vehicleType, quantity } = req.body;
    const result = calculateFreight(city, vehicleType, quantity);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
