const mongoose = require('mongoose');

const kasSchema = new mongoose.Schema({
  type: { type: String, enum: ['masuk', 'keluar'], required: true },
  date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  location: { type: String, enum: ['Batavia', 'Puri', 'Proyek'], required: function() { return this.type === 'keluar'; } },
  expenseType: { type: String, enum: ['bensin', 'oli', 'sparepart'], required: function() { return this.type === 'keluar'; } },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Kas', kasSchema);
