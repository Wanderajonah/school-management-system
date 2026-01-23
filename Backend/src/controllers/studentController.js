const Student = require('../models/Student');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getStudents = asyncHandler(async (req, res, next) => {
  const { search, class: classId, status, page = 1, limit = 10 } = req.query;

  let query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by class
  if (classId) {
    query.class = classId;
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  const total = await Student.countDocuments(query);
  const students = await Student.find(query)
    .populate('class', 'name room')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: students.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: students,
  });
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id).populate('class', 'name room classTeacher');

  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private
exports.createStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.create(req.body);

  res.status(201).json({
    success: true,
    data: student,
  });
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
exports.updateStudent = asyncHandler(async (req, res, next) => {
  let student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }

  student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: student,
  });
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
exports.deleteStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }

  await student.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get students by class
// @route   GET /api/students/class/:classId
// @access  Private
exports.getStudentsByClass = asyncHandler(async (req, res, next) => {
  const students = await Student.find({ class: req.params.classId, status: 'Active' })
    .select('studentId firstName lastName email status')
    .sort({ lastName: 1 });

  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

// @desc    Transfer student to another class
// @route   PUT /api/students/:id/transfer
// @access  Private (Admin)
exports.transferStudent = asyncHandler(async (req, res, next) => {
  const { newClass } = req.body;

  let student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found',
    });
  }

  student.class = newClass;
  await student.save();

  res.status(200).json({
    success: true,
    data: student,
  });
});

// @desc    Get student stats
// @route   GET /api/students/stats
// @access  Private
exports.getStudentStats = asyncHandler(async (req, res, next) => {
  const totalStudents = await Student.countDocuments();
  const activeStudents = await Student.countDocuments({ status: 'Active' });
  const inactiveStudents = await Student.countDocuments({ status: 'Inactive' });

  // Students by class
  const studentsByClass = await Student.aggregate([
    { $match: { status: 'Active' } },
    { $group: { _id: '$class', count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      total: totalStudents,
      active: activeStudents,
      inactive: inactiveStudents,
      byClass: studentsByClass,
    },
  });
});
