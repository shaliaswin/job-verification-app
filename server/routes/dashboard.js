const express = require('express');
const router = express.Router();
const Absensi = require('../models/Absensi');
const Kas = require('../models/Kas');
const auth = require('../middleware/auth');

// Get dashboard summary
router.get('/summary', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    // Attendance counts
    const todayAttendance = await Absensi.aggregate([
      { $match: { createdBy: req.user.id, date: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, count: { $sum: { $cond: [
        { $eq: ["$location", "Proyek"] }, 
        "$projectPersonnel.count", 
        { $size: { $filter: { input: "$employees", as: "emp", cond: "$$emp.present" } } }
      ] } } } }
    ]);

    const monthAttendance = await Absensi.aggregate([
      { $match: { createdBy: req.user.id, date: { $gte: firstDayOfMonth } } },
      { $group: { _id: null, count: { $sum: { $cond: [
        { $eq: ["$location", "Proyek"] }, 
        "$projectPersonnel.count", 
        { $size: { $filter: { input: "$employees", as: "emp", cond: "$$emp.present" } } }
      ] } } } }
    ]);

    const yearAttendance = await Absensi.aggregate([
      { $match: { createdBy: req.user.id, date: { $gte: firstDayOfYear } } },
      { $group: { _id: null, count: { $sum: { $cond: [
        { $eq: ["$location", "Proyek"] }, 
        "$projectPersonnel.count", 
        { $size: { $filter: { input: "$employees", as: "emp", cond: "$$emp.present" } } }
      ] } } } }
    ]);

    // Cash flow
    const monthCashIn = await Kas.aggregate([
      { $match: { createdBy: req.user.id, type: 'masuk', date: { $gte: firstDayOfMonth } } },
      { $group: { _id: null, amount: { $sum: "$amount" } } }
    ]);

    const monthCashOut = await Kas.aggregate([
      { $match: { createdBy: req.user.id, type: 'keluar', date: { $gte: firstDayOfMonth } } },
      { $group: { _id: null, amount: { $sum: "$amount" } } }
    ]);

    res.json({
      todayAttendance: todayAttendance[0]?.count || 0,
      monthAttendance: monthAttendance[0]?.count || 0,
      yearAttendance: yearAttendance
