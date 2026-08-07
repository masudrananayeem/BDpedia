import express from 'express';
import Subscriber from '../models/Subscriber.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/newsletter/subscribe (public)
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Please provide an email address' });

    const exists = await Subscriber.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(200).json({ message: 'You are already subscribed' });

    await Subscriber.create({ email });
    res.status(201).json({ message: 'Subscribed, thank you!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/newsletter (admin) - list all subscribers
router.get('/', protect, adminOnly, async (_req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/newsletter/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const sub = await Subscriber.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Not found' });
    await sub.deleteOne();
    res.json({ message: 'Deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
