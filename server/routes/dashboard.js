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
      yearAttendance: yearAttendance[0]?.count || 0,
      monthCashIn: monthCashIn[0]?.amount || 0,
      monthCashOut: monthCashOut[0]?.amount || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get attendance by location
router.get('/attendance', auth, async (req, res) => {
  try {
    const { timeRange, location } = req.query;
    
    let groupBy, dateFilter;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch(timeRange) {
      case 'day':
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
        dateFilter = { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) };
        break;
      case 'month':
        groupBy = { $dateToString: { format: "%Y-%m", date: "$date" } };
        dateFilter = { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) };
        break;
      case 'year':
        groupBy = { $dateToString: { format: "%Y", date: "$date" } };
        dateFilter = { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 5)) };
        break;
      default:
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
        dateFilter = { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) };
    }

    const match = { 
      createdBy: req.user.id,
      date: dateFilter
    };
    
    if (location && location !== 'all') {
      match.location = location;
    }

    const attendance = await Absensi.aggregate([
      { $match: match },
      { $group: { 
        _id: { 
          location: "$location",
          date: groupBy
        },
        count: { $sum: { $cond: [
          { $eq: ["$location", "Proyek"] }, 
          "$projectPersonnel.count", 
          { $size: { $filter: { input: "$employees", as: "emp", cond: "$$emp.present" } } }
        ] } }
      }},
      { $sort: { "_id.date": 1 } }
    ]);

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get cash flow data
router.get('/cashflow', auth, async (req, res) => {
  try {
    const cashFlow = await Kas.aggregate([
      { $match: { createdBy: req.user.id } },
      { $group: { 
        _id: { 
          $dateToString: { format: "%Y-%m", date: "$date" }
        },
        income: { $sum: { $cond: [ { $eq: ["$type", "masuk"] }, "$amount", 0 ] } },
        expense: { $sum: { $cond: [ { $eq: ["$type", "keluar"] }, "$amount", 0 ] } }
      }},
      { $sort: { "_id": 1 } }
    ]);

    res.json(cashFlow);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
