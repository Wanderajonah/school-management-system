const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a class name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    academicYear: {
      type: String,
      required: [true, 'Please add an academic year'],
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    room: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
      default: 40,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
    schedule: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        },
        periods: [
          {
            subject: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Subject',
            },
            teacher: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Teacher',
            },
            startTime: String,
            endTime: String,
          },
        ],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate students
classSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'class',
  justOne: false,
});

// Virtual for student count
classSchema.virtual('studentCount', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'class',
  count: true,
});

module.exports = mongoose.model('Class', classSchema);
