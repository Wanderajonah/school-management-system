const express = require('express');
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  assignSubjects,
  assignClasses,
  getTeacherStats,
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');
const validations = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/stats').get(getTeacherStats);

router
  .route('/')
  .get(getTeachers)
  .post(authorize('admin'), validations.createTeacher, createTeacher);

router
  .route('/:id')
  .get(validations.mongoId, getTeacher)
  .put(validations.mongoId, authorize('admin'), updateTeacher)
  .delete(validations.mongoId, authorize('admin'), deleteTeacher);

router.route('/:id/subjects').put(validations.mongoId, authorize('admin'), assignSubjects);
router.route('/:id/classes').put(validations.mongoId, authorize('admin'), assignClasses);

module.exports = router;
