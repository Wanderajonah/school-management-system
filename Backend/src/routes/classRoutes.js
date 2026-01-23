const express = require('express');
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  getClassStudents,
  promoteStudents,
  assignSubjects,
  getClassStats,
} = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');
const validations = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/stats').get(getClassStats);

router
  .route('/')
  .get(getClasses)
  .post(authorize('admin'), validations.createClass, createClass);

router
  .route('/:id')
  .get(validations.mongoId, getClass)
  .put(validations.mongoId, authorize('admin'), updateClass)
  .delete(validations.mongoId, authorize('admin'), deleteClass);

router.route('/:id/students').get(validations.mongoId, getClassStudents);
router.route('/:id/promote').post(validations.mongoId, authorize('admin'), promoteStudents);
router.route('/:id/subjects').put(validations.mongoId, authorize('admin'), assignSubjects);

module.exports = router;
