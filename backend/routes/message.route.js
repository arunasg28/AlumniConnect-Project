// backend/routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/message.model.js');

// Send a message
router.post('/send', async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  try {
    const message = new Message({ senderId, receiverId, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Message sending failed' });
  }
});

// Get conversation between two users
router.get('/conversation/:userId/:contactId', async (req, res) => {
  const { userId, contactId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId },
      ],
    }).sort('createdAt');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Fetching messages failed' });
  }
});

module.exports = router;
