const Teacher = require('../models/Teacher');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private
exports.getTeachers = asyncHandler(async (req, res, next) => {
  const { search, status, page = 1, limit = 10 } = req.query;

  let query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { teacherId: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  const total = await Teacher.countDocuments(query);
  const teachers = await Teacher.find(query)
    .populate('subjects', 'name code')
    .populate('classes', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: teachers.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: teachers,
  });
});

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Private
exports.getTeacher = asyncHandler(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.id)
    .populate('subjects', 'name code department')
    .populate('classes', 'name room');

  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: 'Teacher not found',
    });
  }

  res.status(200).json({
    success: true,
    data: teacher,
  });
});

// @desc    Create new teacher
// @route   POST /api/teachers
// @access  Private (Admin)
exports.createTeacher = asyncHandler(async (req, res, next) => {
  const teacher = await Teacher.create(req.body);

  res.status(201).json({
    success: true,
    data: teacher,
  });
});

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private (Admin)
exports.updateTeacher = asyncHandler(async (req, res, next) => {
  let teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: 'Teacher not found',
    });
  }

  teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: teacher,
  });
});

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private (Admin)
exports.deleteTeacher = asyncHandler(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: 'Teacher not found',
    });
  }

  await teacher.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Assign subjects to teacher
// @route   PUT /api/teachers/:id/subjects
// @access  Private (Admin)
exports.assignSubjects = asyncHandler(async (req, res, next) => {
  const { subjects } = req.body;

  let teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: 'Teacher not found',
    });
  }

  teacher.subjects = subjects;
  await teacher.save();

  res.status(200).json({
    success: true,
    data: teacher,
  });
});

// @desc    Assign classes to teacher
// @route   PUT /api/teachers/:id/classes
// @access  Private (Admin)
exports.assignClasses = asyncHandler(async (req, res, next) => {
  const { classes } = req.body;

  let teacher = await Teacher.findById(req.params.id);

  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: 'Teacher not found',
    });
  }

  teacher.classes = classes;
  await teacher.save();

  res.status(200).json({
    success: true,
    data: teacher,
  });
});

// @desc    Get teacher stats
// @route   GET /api/teachers/stats
// @access  Private
exports.getTeacherStats = asyncHandler(async (req, res, next) => {
  const totalTeachers = await Teacher.countDocuments();
  const activeTeachers = await Teacher.countDocuments({ status: 'Active' });
  const onLeave = await Teacher.countDocuments({ status: 'On Leave' });

  res.status(200).json({
    success: true,
    data: {
      total: totalTeachers,
      active: activeTeachers,
      onLeave,
    },
  });
});
