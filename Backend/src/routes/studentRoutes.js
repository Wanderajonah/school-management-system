const express = require('express');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
  transferStudent,
  getStudentStats,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const validations = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/stats').get(getStudentStats);
router.route('/class/:classId').get(getStudentsByClass);

router
  .route('/')
  .get(getStudents)
  .post(validations.createStudent, createStudent);

router
  .route('/:id')
  .get(validations.mongoId, getStudent)
  .put(validations.mongoId, updateStudent)
  .delete(validations.mongoId, authorize('admin'), deleteStudent);

router.route('/:id/transfer').put(validations.mongoId, authorize('admin'), transferStudent);

module.exports = router;
