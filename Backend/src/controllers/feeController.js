const FeeStructure = require('../models/FeeStructure');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/asyncHandler');

// ==================== FEE STRUCTURE ====================

// @desc    Get all fee structures
// @route   GET /api/fees/structure
// @access  Private
exports.getFeeStructures = asyncHandler(async (req, res, next) => {
  const { academicYear, class: className } = req.query;

  let query = {};
  if (academicYear) query.academicYear = academicYear;
  if (className) query.class = className;

  const structures = await FeeStructure.find(query).sort({ class: 1 });

  res.status(200).json({
    success: true,
    count: structures.length,
    data: structures,
  });
});

// @desc    Get single fee structure
// @route   GET /api/fees/structure/:id
// @access  Private
exports.getFeeStructure = asyncHandler(async (req, res, next) => {
  const structure = await FeeStructure.findById(req.params.id);

  if (!structure) {
    return res.status(404).json({
      success: false,
      message: 'Fee structure not found',
    });
  }

  res.status(200).json({
    success: true,
    data: structure,
  });
});

// @desc    Create fee structure
// @route   POST /api/fees/structure
// @access  Private (Admin)
exports.createFeeStructure = asyncHandler(async (req, res, next) => {
  const structure = await FeeStructure.create(req.body);

  res.status(201).json({
    success: true,
    data: structure,
  });
});

// @desc    Update fee structure
// @route   PUT /api/fees/structure/:id
// @access  Private (Admin)
exports.updateFeeStructure = asyncHandler(async (req, res, next) => {
  let structure = await FeeStructure.findById(req.params.id);

  if (!structure) {
    return res.status(404).json({
      success: false,
      message: 'Fee structure not found',
    });
  }

  structure = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: structure,
  });
});

// @desc    Delete fee structure
// @route   DELETE /api/fees/structure/:id
// @access  Private (Admin)
exports.deleteFeeStructure = asyncHandler(async (req, res, next) => {
  const structure = await FeeStructure.findById(req.params.id);

  if (!structure) {
    return res.status(404).json({
      success: false,
      message: 'Fee structure not found',
    });
  }

  await structure.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// ==================== PAYMENTS ====================

// @desc    Get all payments
// @route   GET /api/fees/payments
// @access  Private
exports.getPayments = asyncHandler(async (req, res, next) => {
  const { 
    student, 
    term, 
    academicYear, 
    status,
    page = 1,
    limit = 20 
  } = req.query;

  let query = {};
  if (student) query.student = student;
  if (term) query.term = term;
  if (academicYear) query.academicYear = academicYear;
  if (status) query.status = status;

  const total = await Payment.countDocuments(query);
  const payments = await Payment.find(query)
    .populate({
      path: 'student',
      select: 'studentId firstName lastName class',
      populate: { path: 'class', select: 'name' },
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: payments.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: payments,
  });
});

// @desc    Get single payment
// @route   GET /api/fees/payments/:id
// @access  Private
exports.getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)
    .populate({
      path: 'student',
      select: 'studentId firstName lastName email class boardingStatus',
      populate: { path: 'class', select: 'name' },
    })
    .populate('paymentHistory.receivedBy', 'name');

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment record not found',
    });
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
});

// @desc    Get student payment records
// @route   GET /api/fees/payments/student/:studentId
// @access  Private
exports.getStudentPayments = asyncHandler(async (req, res, next) => {
  const payments = await Payment.find({ student: req.params.studentId })
    .sort({ academicYear: -1, term: 1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments,
  });
});

// @desc    Initialize payment record for student
// @route   POST /api/fees/payments/initialize
// @access  Private
exports.initializePayment = asyncHandler(async (req, res, next) => {
  const { student, term, academicYear } = req.body;

  // Get student info to determine fee structure
  const studentData = await Student.findById(student).populate('class', 'name');
  if (!studentData) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }

  // Get fee structure
  const feeStructure = await FeeStructure.findOne({
    class: studentData.class.name,
    academicYear,
    isActive: true,
  });

  if (!feeStructure) {
    return res.status(404).json({
      success: false,
      message: 'Fee structure not found for this class',
    });
  }

  // Calculate amount due based on boarding status
  const amountDue = studentData.boardingStatus === 'Boarding' 
    ? feeStructure.totalBoarding 
    : feeStructure.totalDay;

  // Check if payment record already exists
  let payment = await Payment.findOne({ student, term, academicYear });

  if (payment) {
    return res.status(400).json({
      success: false,
      message: 'Payment record already exists for this term',
    });
  }

  payment = await Payment.create({
    student,
    term,
    academicYear,
    amountDue,
  });

  res.status(201).json({
    success: true,
    data: payment,
  });
});

// @desc    Record a payment
// @route   POST /api/fees/payments/:id/pay
// @access  Private
exports.recordPayment = asyncHandler(async (req, res, next) => {
  const { amount, paymentMethod, transactionId, remarks } = req.body;

  let payment = await Payment.findById(req.params.id);

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment record not found',
    });
  }

  // Generate receipt number
  const receiptNumber = payment.generateReceiptNumber();

  // Add to payment history
  payment.paymentHistory.push({
    amount,
    paymentMethod,
    transactionId,
    receiptNumber,
    paymentDate: new Date(),
    receivedBy: req.user._id,
    remarks,
  });

  // Update amount paid
  payment.amountPaid += amount;

  await payment.save();

  res.status(200).json({
    success: true,
    message: 'Payment recorded successfully',
    receiptNumber,
    data: payment,
  });
});

// @desc    Get payment statistics
// @route   GET /api/fees/stats
// @access  Private
exports.getPaymentStats = asyncHandler(async (req, res, next) => {
  const { term, academicYear } = req.query;

  let query = {};
  if (term) query.term = term;
  if (academicYear) query.academicYear = academicYear;

  const stats = await Payment.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalDue: { $sum: '$amountDue' },
        totalPaid: { $sum: '$amountPaid' },
        totalBalance: { $sum: '$balance' },
      },
    },
  ]);

  // Format stats
  const formattedStats = {
    paid: { count: 0, totalDue: 0, totalPaid: 0 },
    partial: { count: 0, totalDue: 0, totalPaid: 0, totalBalance: 0 },
    unpaid: { count: 0, totalDue: 0 },
    total: { count: 0, totalDue: 0, totalPaid: 0, totalBalance: 0 },
  };

  stats.forEach(stat => {
    const status = stat._id.toLowerCase();
    formattedStats[status] = {
      count: stat.count,
      totalDue: stat.totalDue,
      totalPaid: stat.totalPaid,
      totalBalance: stat.totalBalance || 0,
    };
    formattedStats.total.count += stat.count;
    formattedStats.total.totalDue += stat.totalDue;
    formattedStats.total.totalPaid += stat.totalPaid;
    formattedStats.total.totalBalance += stat.totalBalance || 0;
  });

  res.status(200).json({
    success: true,
    data: formattedStats,
  });
});

// @desc    Get students with arrears
// @route   GET /api/fees/arrears
// @access  Private
exports.getStudentsWithArrears = asyncHandler(async (req, res, next) => {
  const { term, academicYear, minBalance = 0 } = req.query;

  let query = {
    status: { $in: ['Partial', 'Unpaid'] },
    balance: { $gt: parseInt(minBalance) },
  };
  if (term) query.term = term;
  if (academicYear) query.academicYear = academicYear;

  const arrears = await Payment.find(query)
    .populate({
      path: 'student',
      select: 'studentId firstName lastName class',
      populate: { path: 'class', select: 'name' },
    })
    .sort({ balance: -1 });

  res.status(200).json({
    success: true,
    count: arrears.length,
    data: arrears,
  });
});
