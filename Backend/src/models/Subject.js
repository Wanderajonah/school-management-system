const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a subject name'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please add a subject code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: String,
      enum: [
        'Science & Mathematics',
        'Languages',
        'Social Studies',
        'Physical Education',
        'Religious Education',
        'Business Studies',
        'Practical (Pre-vocational)',
        'Language Electives',
        'Religious Education Electives',
      ],
      required: [true, 'Please add a department'],
    },
    type: {
      type: String,
      enum: ['Compulsory', 'Elective'],
      default: 'Compulsory',
    },
    classes: [
      {
        type: String,
        enum: ['S1', 'S2', 'S3', 'S4'],
      },
    ],
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    description: {
      type: String,
      trim: true,
    },
    creditHours: {
      type: Number,
      default: 3,
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

// Index for search
subjectSchema.index({ name: 'text', code: 'text' });

module.exports = mongoose.model('Subject', subjectSchema);
