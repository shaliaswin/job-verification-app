const express = require('express');
const router = express.Router();
const Kas = require('../models/Kas');
const auth = require('../middleware/auth');

// Create new kas transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, date, amount, location, expenseType } = req.body;
    
    const kas = new Kas({
      type,
      date: new Date(date),
      amount,
      location: type === 'keluar' ? location : undefined,
      expenseType: type === 'keluar' ? expenseType : undefined,
      createdBy: req.user.id
    });

    await kas.save();
    res.status(201).json(kas);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get kas transactions with filters
router.get('/', auth, async (req, res) => {
  try {
    const { type, startDate, endDate, location } = req.query;
    const filter = { createdBy: req.user.id };

    if (type) filter.type = type;
    if (location) filter.location = location;
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const kas = await Kas.find(filter).sort('-date');
    res.json(kas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
