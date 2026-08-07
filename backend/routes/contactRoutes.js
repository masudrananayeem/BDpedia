import express from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/contact  (public) - visitor sends a message from the Contact page
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are all required' });
    }
    const doc = await ContactMessage.create({ name, email, message });
    res.status(201).json({ message: 'Message sent, thank you!', id: doc._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/contact  (admin) - list all messages, newest first
router.get('/', protect, adminOnly, async (_req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/contact/:id/read  (admin) - toggle read/unread
router.patch('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const doc = await ContactMessage.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Message not found' });
    doc.read = !doc.read;
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/contact/:id  (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const doc = await ContactMessage.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Message not found' });
    await doc.deleteOne();
    res.json({ message: 'Deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
