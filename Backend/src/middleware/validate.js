const { validationResult, body, param, query } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Common validation rules
const validations = {
  // Student validations
  createStudent: [
    body('firstName').notEmpty().withMessage('First name is required').trim(),
    body('lastName').notEmpty().withMessage('Last name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('class').notEmpty().withMessage('Class is required'),
    handleValidationErrors,
  ],

  // Teacher validations
  createTeacher: [
    body('firstName').notEmpty().withMessage('First name is required').trim(),
    body('lastName').notEmpty().withMessage('Last name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email'),
    handleValidationErrors,
  ],

  // Class validations
  createClass: [
    body('name').notEmpty().withMessage('Class name is required').trim(),
    body('academicYear').notEmpty().withMessage('Academic year is required'),
    handleValidationErrors,
  ],

  // Subject validations
  createSubject: [
    body('name').notEmpty().withMessage('Subject name is required').trim(),
    body('code').notEmpty().withMessage('Subject code is required').trim(),
    body('department').notEmpty().withMessage('Department is required'),
    handleValidationErrors,
  ],

  // Attendance validations
  createAttendance: [
    body('date').isISO8601().withMessage('Please provide a valid date'),
    body('class').notEmpty().withMessage('Class is required'),
    body('records').isArray({ min: 1 }).withMessage('At least one record is required'),
    handleValidationErrors,
  ],

  // Grade validations
  createGrade: [
    body('student').notEmpty().withMessage('Student is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('assignment').notEmpty().withMessage('Assignment name is required'),
    body('score').isNumeric().withMessage('Score must be a number'),
    body('maxScore').isNumeric().withMessage('Max score must be a number'),
    body('term').notEmpty().withMessage('Term is required'),
    body('academicYear').notEmpty().withMessage('Academic year is required'),
    handleValidationErrors,
  ],

  // Payment validations
  recordPayment: [
    body('student').notEmpty().withMessage('Student is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    handleValidationErrors,
  ],

  // Auth validations
  register: [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    handleValidationErrors,
  ],

  login: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
  ],

  // MongoDB ObjectId validation
  mongoId: [
    param('id').isMongoId().withMessage('Invalid ID format'),
    handleValidationErrors,
  ],
};

module.exports = validations;
