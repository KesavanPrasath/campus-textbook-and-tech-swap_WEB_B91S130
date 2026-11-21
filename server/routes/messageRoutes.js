const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const MessageThread = require('../models/MessageThread');
const { protect } = require('../middleware/authMiddleware');

// GET /api/messages - all threads where current user is buyer or seller
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const threads = await MessageThread.find({
      $or: [{ buyer: userId }, { seller: userId }],
    })
      .populate('item', 'title price')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .populate('messages.sender', 'name')
      .sort({ updatedAt: -1 });

    res.json(threads);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load messages' });
  }
});

// POST /api/messages - create or append a buy request / message on an item
router.post('/', protect, async (req, res) => {
  try {
    const { itemId, text } = req.body;
    const senderId = req.user._id;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const sellerId = item.user;
    const isSeller = sellerId.toString() === senderId.toString();

    const buyerId = isSeller ? req.body.buyerId : senderId;
    if (!buyerId) {
      return res.status(400).json({ message: 'buyerId is required when seller replies' });
    }

    if (!isSeller && buyerId.toString() === sellerId.toString()) {
      return res.status(400).json({ message: 'You cannot send a buy request on your own item' });
    }

    const messageText =
      text && text.trim()
        ? text.trim()
        : `Hi, I'm interested in buying "${item.title}".`;

    let thread = await MessageThread.findOne({ item: itemId, buyer: buyerId });

    if (!thread) {
      thread = await MessageThread.create({
        item: itemId,
        buyer: buyerId,
        seller: sellerId,
        messages: [{ sender: senderId, text: messageText }],
      });
    } else {
      thread.messages.push({ sender: senderId, text: messageText });
      await thread.save();
    }

    const populated = await MessageThread.findById(thread._id)
      .populate('item', 'title price')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .populate('messages.sender', 'name');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;