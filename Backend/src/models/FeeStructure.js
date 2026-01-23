const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema(
  {
    class: {
      type: String,
      required: [true, 'Please add a class'],
      enum: ['S1', 'S2', 'S3', 'S4'],
    },
    academicYear: {
      type: String,
      required: [true, 'Please add an academic year'],
    },
    term: {
      type: String,
      enum: ['First Term', 'Second Term', 'Third Term', 'All Terms'],
      default: 'All Terms',
    },
    termFee: {
      type: Number,
      required: [true, 'Please add term fee'],
      default: 0,
    },
    boardingFee: {
      type: Number,
      default: 0,
    },
    dayFee: {
      type: Number,
      default: 0,
    },
    activitiesFee: {
      type: Number,
      default: 0,
    },
    examFee: {
      type: Number,
      default: 0,
    },
    libraryFee: {
      type: Number,
      default: 0,
    },
    laboratoryFee: {
      type: Number,
      default: 0,
    },
    otherFees: [
      {
        name: String,
        amount: Number,
      },
    ],
    totalBoarding: {
      type: Number,
    },
    totalDay: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate totals before saving
feeStructureSchema.pre('save', function (next) {
  const otherFeesTotal = this.otherFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
  
  this.totalBoarding = this.termFee + this.boardingFee + this.activitiesFee + 
                       this.examFee + this.libraryFee + this.laboratoryFee + otherFeesTotal;
  
  this.totalDay = this.termFee + this.dayFee + this.activitiesFee + 
                  this.examFee + this.libraryFee + this.laboratoryFee + otherFeesTotal;
  
  next();
});

// Compound index for unique fee structure per class per year
feeStructureSchema.index({ class: 1, academicYear: 1, term: 1 }, { unique: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);
