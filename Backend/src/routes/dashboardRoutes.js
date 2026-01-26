const express = require('express');
const {
  getDashboardStats,
  getRecentActivities,
  getAttendanceOverview,
  getClassDistribution,
  getGenderDistribution,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/stats').get(getDashboardStats);
router.route('/activities').get(getRecentActivities);
router.route('/attendance-overview').get(getAttendanceOverview);
router.route('/class-distribution').get(getClassDistribution);
router.route('/gender-distribution').get(getGenderDistribution);

module.exports = router;
