const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: Number, required: true },
  present: { type: Boolean, required: true }
});

const absensiSchema = new mongoose.Schema({
  location: { 
    type: String, 
    enum: ['Batavia', 'Puri', 'Bliss', 'WP Batavia', 'WP Sepatan', 'Proyek'], 
    required: true 
  },
  date: { type: Date, required: true, default: Date.now },
  employees: { type: [employeeSchema], required: function() { return this.location !== 'Proyek'; } },
  hasReplacement: { type: Boolean, required: function() { 
    return this.location !== 'Proyek' && this.employees.some(e => !e.present); 
  } },
  replacementCount: { type: Number, required: function() { return this.hasReplacement; } },
  projectPersonnel: {
    count: { type: Number, required: function() { return this.location === 'Proyek'; } },
    placement: { 
      type: String, 
      enum: [
        'Kebersihan Cluster', 
        'Kebersihan Kali', 
        'Proyek', 
        'Backup pegawai Puri', 
        'Backup Pegawai Batavia', 
        'Backup Pegawai Bliss', 
        'Backup Pegawai WP Batavia', 
        'Backup Pegawai WP Sepatan'
      ],
      required: function() { return this.location === 'Proyek'; }
    }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Absensi', absensiSchema);
