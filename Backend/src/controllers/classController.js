const Class = require('../models/Class');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private
exports.getClasses = asyncHandler(async (req, res, next) => {
  const { search, academicYear, isActive } = req.query;

  let query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (academicYear) {
    query.academicYear = academicYear;
  }

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const classes = await Class.find(query)
    .populate('classTeacher', 'firstName lastName email')
    .populate('subjects', 'name code')
    .populate('studentCount')
    .sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: classes.length,
    data: classes,
  });
});

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Private
exports.getClass = asyncHandler(async (req, res, next) => {
  const classData = await Class.findById(req.params.id)
    .populate('classTeacher', 'firstName lastName email phone')
    .populate('subjects', 'name code department teacher')
    .populate({
      path: 'students',
      select: 'studentId firstName lastName email status',
    });

  if (!classData) {
    return res.status(404).json({
      success: false,
      message: 'Class not found',
    });
  }

  res.status(200).json({
    success: true,
    data: classData,
  });
});

// @desc    Create new class
// @route   POST /api/classes
// @access  Private (Admin)
exports.createClass = asyncHandler(async (req, res, next) => {
  const classData = await Class.create(req.body);

  res.status(201).json({
    success: true,
    data: classData,
  });
});

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private (Admin)
exports.updateClass = asyncHandler(async (req, res, next) => {
  let classData = await Class.findById(req.params.id);

  if (!classData) {
    return res.status(404).json({
      success: false,
      message: 'Class not found',
    });
  }

  classData = await Class.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: classData,
  });
});

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private (Admin)
exports.deleteClass = asyncHandler(async (req, res, next) => {
  const classData = await Class.findById(req.params.id);

  if (!classData) {
    return res.status(404).json({
      success: false,
      message: 'Class not found',
    });
  }

  // Check if class has students
  const studentCount = await Student.countDocuments({ class: req.params.id });
  if (studentCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete class. ${studentCount} students are enrolled in this class.`,
    });
  }

  await classData.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get students in a class
// @route   GET /api/classes/:id/students
// @access  Private
exports.getClassStudents = asyncHandler(async (req, res, next) => {
  const students = await Student.find({ class: req.params.id, status: 'Active' })
    .select('studentId firstName lastName email phone status')
    .sort({ lastName: 1 });

  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

// @desc    Promote students to next class
// @route   POST /api/classes/:id/promote
// @access  Private (Admin)
exports.promoteStudents = asyncHandler(async (req, res, next) => {
  const { targetClass, studentIds } = req.body;

  // Validate target class exists
  const targetClassData = await Class.findById(targetClass);
  if (!targetClassData) {
    return res.status(404).json({
      success: false,
      message: 'Target class not found',
    });
  }

  // Update students' class
  const result = await Student.updateMany(
    { _id: { $in: studentIds } },
    { class: targetClass }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} students promoted successfully`,
    data: result,
  });
});

// @desc    Assign subjects to class
// @route   PUT /api/classes/:id/subjects
// @access  Private (Admin)
exports.assignSubjects = asyncHandler(async (req, res, next) => {
  const { subjects } = req.body;

  let classData = await Class.findById(req.params.id);

  if (!classData) {
    return res.status(404).json({
      success: false,
      message: 'Class not found',
    });
  }

  classData.subjects = subjects;
  await classData.save();

  res.status(200).json({
    success: true,
    data: classData,
  });
});

// @desc    Get class stats
// @route   GET /api/classes/stats
// @access  Private
exports.getClassStats = asyncHandler(async (req, res, next) => {
  const totalClasses = await Class.countDocuments();
  const activeClasses = await Class.countDocuments({ isActive: true });

  // Get student count per class
  const classStudentCounts = await Student.aggregate([
    { $match: { status: 'Active' } },
    { $group: { _id: '$class', studentCount: { $sum: 1 } } },
    {
      $lookup: {
        from: 'classes',
        localField: '_id',
        foreignField: '_id',
        as: 'classInfo',
      },
    },
    { $unwind: '$classInfo' },
    {
      $project: {
        className: '$classInfo.name',
        studentCount: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      total: totalClasses,
      active: activeClasses,
      classStudentCounts,
    },
  });
});
