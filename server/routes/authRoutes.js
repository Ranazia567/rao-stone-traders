import express from 'express';
import jwt from 'jsonwebtoken';
import { findAdminUser, verifyAdminPassword } from '../services/dataService.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await findAdminUser(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await verifyAdminPassword(user, password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'rao_stone_traders_secret',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
