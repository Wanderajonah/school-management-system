const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Please add a student'],
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Please add a class'],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Please add a subject'],
    },
    assignment: {
      type: String,
      required: [true, 'Please add an assignment name'],
      trim: true,
    },
    assignmentType: {
      type: String,
      enum: ['Quiz', 'Test', 'Midterm Exam', 'Final Exam', 'Assignment', 'Project', 'Lab Report', 'Homework'],
      default: 'Assignment',
    },
    score: {
      type: Number,
      required: [true, 'Please add a score'],
      min: 0,
    },
    maxScore: {
      type: Number,
      required: [true, 'Please add a maximum score'],
      min: 1,
    },
    weight: {
      type: Number,
      default: 1,
      min: 0,
    },
    grade: {
      type: String,
      trim: true,
    },
    term: {
      type: String,
      enum: ['First Term', 'Second Term', 'Third Term'],
      required: [true, 'Please add a term'],
    },
    academicYear: {
      type: String,
      required: [true, 'Please add an academic year'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      trim: true,
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Calculate letter grade before saving
gradeSchema.pre('save', function (next) {
  const percentage = (this.score / this.maxScore) * 100;
  
  if (percentage >= 90) this.grade = 'A+';
  else if (percentage >= 85) this.grade = 'A';
  else if (percentage >= 80) this.grade = 'A-';
  else if (percentage >= 75) this.grade = 'B+';
  else if (percentage >= 70) this.grade = 'B';
  else if (percentage >= 65) this.grade = 'B-';
  else if (percentage >= 60) this.grade = 'C+';
  else if (percentage >= 55) this.grade = 'C';
  else if (percentage >= 50) this.grade = 'C-';
  else if (percentage >= 45) this.grade = 'D+';
  else if (percentage >= 40) this.grade = 'D';
  else this.grade = 'F';
  
  next();
});

// Index for common queries
gradeSchema.index({ student: 1, term: 1, academicYear: 1 });
gradeSchema.index({ class: 1, subject: 1, term: 1 });

module.exports = mongoose.model('Grade', gradeSchema);
