const express = require('express');
const {
  getFeeStructures,
  getFeeStructure,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getPayments,
  getPayment,
  getStudentPayments,
  initializePayment,
  recordPayment,
  getPaymentStats,
  getStudentsWithArrears,
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/auth');
const validations = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Fee Structure routes
router.route('/structure')
  .get(getFeeStructures)
  .post(authorize('admin'), createFeeStructure);

router.route('/structure/:id')
  .get(validations.mongoId, getFeeStructure)
  .put(validations.mongoId, authorize('admin'), updateFeeStructure)
  .delete(validations.mongoId, authorize('admin'), deleteFeeStructure);

// Payment routes
router.route('/payments')
  .get(getPayments);

router.route('/payments/initialize')
  .post(initializePayment);

router.route('/payments/student/:studentId')
  .get(getStudentPayments);

router.route('/payments/:id')
  .get(validations.mongoId, getPayment);

router.route('/payments/:id/pay')
  .post(validations.mongoId, validations.recordPayment, recordPayment);

// Stats
router.route('/stats').get(getPaymentStats);
router.route('/arrears').get(getStudentsWithArrears);

module.exports = router;
