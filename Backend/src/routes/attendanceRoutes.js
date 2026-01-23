const express = require('express');
const {
  getAttendance,
  getAttendanceById,
  markAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceStats,
  getStudentAttendance,
  getTodayAttendance,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');
const validations = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/today').get(getTodayAttendance);
router.route('/stats/:classId').get(getAttendanceStats);
router.route('/student/:studentId').get(getStudentAttendance);

router
  .route('/')
  .get(getAttendance)
  .post(validations.createAttendance, markAttendance);

router
  .route('/:id')
  .get(validations.mongoId, getAttendanceById)
  .put(validations.mongoId, updateAttendance)
  .delete(validations.mongoId, authorize('admin'), deleteAttendance);

module.exports = router;
