const express = require('express');
const {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  assignTeacher,
  getSubjectsByClass,
  getDepartments,
} = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/auth');
const validations = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/departments').get(getDepartments);
router.route('/class/:className').get(getSubjectsByClass);

router
  .route('/')
  .get(getSubjects)
  .post(authorize('admin'), validations.createSubject, createSubject);

router
  .route('/:id')
  .get(validations.mongoId, getSubject)
  .put(validations.mongoId, authorize('admin'), updateSubject)
  .delete(validations.mongoId, authorize('admin'), deleteSubject);

router.route('/:id/teacher').put(validations.mongoId, authorize('admin'), assignTeacher);

module.exports = router;
