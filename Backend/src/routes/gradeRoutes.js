const express = require('express');
const {
  getGrades,
  getGrade,
  createGrade,
  createBulkGrades,
  updateGrade,
  deleteGrade,
  getStudentGrades,
  getClassSubjectGrades,
  getReportCard,
} = require('../controllers/gradeController');
const { protect, authorize } = require('../middleware/auth');
const validations = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/bulk').post(createBulkGrades);
router.route('/student/:studentId').get(getStudentGrades);
router.route('/report-card/:studentId').get(getReportCard);
router.route('/class/:classId/subject/:subjectId').get(getClassSubjectGrades);

router
  .route('/')
  .get(getGrades)
  .post(validations.createGrade, createGrade);

router
  .route('/:id')
  .get(validations.mongoId, getGrade)
  .put(validations.mongoId, updateGrade)
  .delete(validations.mongoId, authorize('admin'), deleteGrade);

module.exports = router;
