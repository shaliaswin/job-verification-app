const express = require('express');
const router = express.Router();
const Absensi = require('../models/Absensi');
const auth = require('../middleware/auth');

// Create new attendance record
router.post('/', auth, async (req, res) => {
  try {
    const { location, date, employees, hasReplacement, replacementCount, projectPersonnel } = req.body;
    
    const absensi = new Absensi({
      location,
      date: new Date(date),
      employees: location !== 'Proyek' ? employees : undefined,
      hasReplacement: location !== 'Proyek' && employees.some(e => !e.present) ? hasReplacement : undefined,
      replacementCount: location !== 'Proyek' && hasReplacement ? replacementCount : undefined,
      projectPersonnel: location === 'Proyek' ? projectPersonnel : undefined,
      createdBy: req.user.id
    });

    await absensi.save();
    res.status(201).json(absensi);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get attendance records with filters
router.get('/', auth, async (req, res) => {
  try {
    const { location, startDate, endDate } = req.query;
    const filter = { createdBy: req.user.id };

    if (location) filter.location = location;
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const absensi = await Absensi.find(filter).sort('-date');
    res.json(absensi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
