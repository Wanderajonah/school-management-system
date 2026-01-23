const Subject = require('../models/Subject');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
exports.getSubjects = asyncHandler(async (req, res, next) => {
  const { search, department, type, class: className } = req.query;

  let query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
    ];
  }

  if (department) {
    query.department = department;
  }

  if (type) {
    query.type = type;
  }

  if (className) {
    query.classes = className;
  }

  const subjects = await Subject.find(query)
    .populate('teacher', 'firstName lastName email')
    .sort({ type: 1, name: 1 });

  res.status(200).json({
    success: true,
    count: subjects.length,
    data: subjects,
  });
});

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Private
exports.getSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id).populate(
    'teacher',
    'firstName lastName email phone'
  );

  if (!subject) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found',
    });
  }

  res.status(200).json({
    success: true,
    data: subject,
  });
});

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private (Admin)
exports.createSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.create(req.body);

  res.status(201).json({
    success: true,
    data: subject,
  });
});

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin)
exports.updateSubject = asyncHandler(async (req, res, next) => {
  let subject = await Subject.findById(req.params.id);

  if (!subject) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found',
    });
  }

  subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: subject,
  });
});

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin)
exports.deleteSubject = asyncHandler(async (req, res, next) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found',
    });
  }

  await subject.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Assign teacher to subject
// @route   PUT /api/subjects/:id/teacher
// @access  Private (Admin)
exports.assignTeacher = asyncHandler(async (req, res, next) => {
  const { teacher } = req.body;

  let subject = await Subject.findById(req.params.id);

  if (!subject) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found',
    });
  }

  subject.teacher = teacher;
  await subject.save();

  res.status(200).json({
    success: true,
    data: subject,
  });
});

// @desc    Get subjects by class
// @route   GET /api/subjects/class/:className
// @access  Private
exports.getSubjectsByClass = asyncHandler(async (req, res, next) => {
  const subjects = await Subject.find({
    classes: req.params.className,
    isActive: true,
  })
    .populate('teacher', 'firstName lastName')
    .sort({ type: 1, name: 1 });

  res.status(200).json({
    success: true,
    count: subjects.length,
    data: subjects,
  });
});

// @desc    Get departments
// @route   GET /api/subjects/departments
// @access  Private
exports.getDepartments = asyncHandler(async (req, res, next) => {
  const departments = await Subject.distinct('department');

  res.status(200).json({
    success: true,
    data: departments,
  });
});
