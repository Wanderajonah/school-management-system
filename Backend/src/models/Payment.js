const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Please add a student'],
    },
    academicYear: {
      type: String,
      required: [true, 'Please add an academic year'],
    },
    term: {
      type: String,
      enum: ['First Term', 'Second Term', 'Third Term'],
      required: [true, 'Please add a term'],
    },
    amountDue: {
      type: Number,
      required: [true, 'Please add amount due'],
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['Unpaid', 'Partial', 'Paid', 'Overpaid'],
      default: 'Unpaid',
    },
    paymentHistory: [
      {
        amount: {
          type: Number,
          required: true,
        },
        paymentMethod: {
          type: String,
          enum: ['Cash', 'Bank Transfer', 'Mobile Money', 'Check', 'Online'],
          default: 'Cash',
        },
        transactionId: String,
        receiptNumber: String,
        paymentDate: {
          type: Date,
          default: Date.now,
        },
        receivedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        remarks: String,
      },
    ],
    lastPaymentDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate balance and status before saving
paymentSchema.pre('save', function (next) {
  this.balance = this.amountDue - this.amountPaid;
  
  if (this.amountPaid === 0) {
    this.status = 'Unpaid';
  } else if (this.amountPaid < this.amountDue) {
    this.status = 'Partial';
  } else if (this.amountPaid === this.amountDue) {
    this.status = 'Paid';
  } else {
    this.status = 'Overpaid';
  }
  
  if (this.paymentHistory.length > 0) {
    this.lastPaymentDate = this.paymentHistory[this.paymentHistory.length - 1].paymentDate;
  }
  
  next();
});

// Generate receipt number
paymentSchema.methods.generateReceiptNumber = function () {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RCP-${year}${month}-${random}`;
};

// Compound index
paymentSchema.index({ student: 1, academicYear: 1, term: 1 }, { unique: true });

module.exports = mongoose.model('Payment', paymentSchema);
