import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getAdminStats,
  getProductById,
  calculateFreight,
} from '../services/dataService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      phone,
      city,
      address,
      material,
      vehicleType,
      quantity,
      productId,
      items,
    } = req.body;

    if (!customerName || !phone || !city || !address) {
      return res.status(400).json({ message: 'Customer details are required' });
    }

    let orderData;

    if (items && items.length > 0) {
      let materialTotal = 0;
      const processedItems = [];
      let primaryMaterial = '';
      let primaryVehicle = 'Dumper';
      let primaryQty = 0;
      let totalFreight = 0;

      for (const item of items) {
        const product = await getProductById(item.productId);
        if (!product) {
          return res.status(400).json({ message: `Product not found: ${item.productId}` });
        }

        const qty = Number(item.quantity) || 1;
        const vType = item.vehicleType || 'Dumper';
        const unitPrice = vType === 'Dumper' ? product.pricePerDumper : product.pricePerTrolley;
        const subtotal = unitPrice * qty;
        materialTotal += subtotal;

        const freightResult = calculateFreight(city, vType, qty);
        if (freightResult.error) {
          return res.status(400).json({ message: freightResult.error });
        }
        totalFreight += freightResult.freight;

        processedItems.push({
          productId: product._id,
          title: product.title,
          vehicleType: vType,
          quantity: qty,
          unitPrice,
          subtotal,
        });

        if (!primaryMaterial) {
          primaryMaterial = product.title;
          primaryVehicle = vType;
          primaryQty = qty;
        } else {
          primaryMaterial += `, ${product.title}`;
        }
      }

      orderData = {
        customerName,
        phone,
        city: calculateFreight(city, primaryVehicle, primaryQty).city || city,
        address,
        material: primaryMaterial,
        vehicleType: primaryVehicle,
        quantity: processedItems.reduce((s, i) => s + i.quantity, 0),
        freightCharge: totalFreight,
        totalPrice: materialTotal + totalFreight,
        items: processedItems,
      };
    } else {
      if (!material || !vehicleType || !quantity) {
        return res.status(400).json({ message: 'Order material details required' });
      }

      let unitPrice = 0;
      let resolvedMaterial = material;

      if (productId) {
        const product = await getProductById(productId);
        if (!product) {
          return res.status(400).json({ message: 'Product not found' });
        }
        unitPrice = vehicleType === 'Dumper' ? product.pricePerDumper : product.pricePerTrolley;
        resolvedMaterial = product.title;
      }

      const qty = Number(quantity) || 1;
      const materialCost = unitPrice * qty;
      const freightResult = calculateFreight(city, vehicleType, qty);

      if (freightResult.error) {
        return res.status(400).json({ message: freightResult.error });
      }

      orderData = {
        customerName,
        phone,
        city: freightResult.city,
        address,
        material: resolvedMaterial,
        vehicleType,
        quantity: qty,
        freightCharge: freightResult.freight,
        totalPrice: materialCost + freightResult.freight,
      };
    }

    const order = await createOrder(orderData);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/track/:id', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      _id: order._id,
      status: order.status,
      material: order.material,
      city: order.city,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.city) filter.city = req.query.city;
    if (req.query.status) filter.status = req.query.status;
    const orders = await getAllOrders(filter);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Pending', 'Confirmed', 'Dispatched', 'Delivered'];

    if (!valid.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await updateOrderStatus(req.params.id, status);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
