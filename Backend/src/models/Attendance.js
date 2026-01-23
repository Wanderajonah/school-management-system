const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    required: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
});

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Please add a class'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
    records: [attendanceRecordSchema],
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    term: {
      type: String,
      enum: ['First Term', 'Second Term', 'Third Term'],
    },
    academicYear: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique attendance per class per date
attendanceSchema.index({ date: 1, class: 1, subject: 1 }, { unique: true });

// Static method to get attendance stats
attendanceSchema.statics.getStats = async function (classId, startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        class: classId,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    { $unwind: '$records' },
    {
      $group: {
        _id: '$records.status',
        count: { $sum: 1 },
      },
    },
  ]);
  return stats;
};

module.exports = mongoose.model('Attendance', attendanceSchema);
