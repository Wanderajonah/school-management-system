const Grade = require('../models/Grade');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all grades
// @route   GET /api/grades
// @access  Private
exports.getGrades = asyncHandler(async (req, res, next) => {
  const { 
    student, 
    class: classId, 
    subject, 
    term, 
    academicYear,
    page = 1,
    limit = 20 
  } = req.query;

  let query = {};

  if (student) query.student = student;
  if (classId) query.class = classId;
  if (subject) query.subject = subject;
  if (term) query.term = term;
  if (academicYear) query.academicYear = academicYear;

  const total = await Grade.countDocuments(query);
  const grades = await Grade.find(query)
    .populate('student', 'studentId firstName lastName')
    .populate('class', 'name')
    .populate('subject', 'name code')
    .populate('enteredBy', 'name')
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: grades.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: grades,
  });
});

// @desc    Get single grade
// @route   GET /api/grades/:id
// @access  Private
exports.getGrade = asyncHandler(async (req, res, next) => {
  const grade = await Grade.findById(req.params.id)
    .populate('student', 'studentId firstName lastName email')
    .populate('class', 'name')
    .populate('subject', 'name code')
    .populate('enteredBy', 'name');

  if (!grade) {
    return res.status(404).json({
      success: false,
      message: 'Grade not found',
    });
  }

  res.status(200).json({
    success: true,
    data: grade,
  });
});

// @desc    Create new grade
// @route   POST /api/grades
// @access  Private
exports.createGrade = asyncHandler(async (req, res, next) => {
  req.body.enteredBy = req.user._id;
  
  const grade = await Grade.create(req.body);

  res.status(201).json({
    success: true,
    data: grade,
  });
});

// @desc    Create bulk grades
// @route   POST /api/grades/bulk
// @access  Private
exports.createBulkGrades = asyncHandler(async (req, res, next) => {
  const { grades } = req.body;

  // Add enteredBy to each grade
  const gradesWithUser = grades.map(grade => ({
    ...grade,
    enteredBy: req.user._id,
  }));

  const createdGrades = await Grade.insertMany(gradesWithUser);

  res.status(201).json({
    success: true,
    count: createdGrades.length,
    data: createdGrades,
  });
});

// @desc    Update grade
// @route   PUT /api/grades/:id
// @access  Private
exports.updateGrade = asyncHandler(async (req, res, next) => {
  let grade = await Grade.findById(req.params.id);

  if (!grade) {
    return res.status(404).json({
      success: false,
      message: 'Grade not found',
    });
  }

  grade = await Grade.findByIdAndUpdate(
    req.params.id,
    { ...req.body, enteredBy: req.user._id },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: grade,
  });
});

// @desc    Delete grade
// @route   DELETE /api/grades/:id
// @access  Private (Admin)
exports.deleteGrade = asyncHandler(async (req, res, next) => {
  const grade = await Grade.findById(req.params.id);

  if (!grade) {
    return res.status(404).json({
      success: false,
      message: 'Grade not found',
    });
  }

  await grade.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get student grades
// @route   GET /api/grades/student/:studentId
// @access  Private
exports.getStudentGrades = asyncHandler(async (req, res, next) => {
  const { term, academicYear } = req.query;

  let query = { student: req.params.studentId };
  if (term) query.term = term;
  if (academicYear) query.academicYear = academicYear;

  const grades = await Grade.find(query)
    .populate('subject', 'name code')
    .populate('class', 'name')
    .sort({ subject: 1, date: -1 });

  // Group grades by subject
  const gradesBySubject = {};
  grades.forEach(grade => {
    const subjectId = grade.subject._id.toString();
    if (!gradesBySubject[subjectId]) {
      gradesBySubject[subjectId] = {
        subject: grade.subject,
        grades: [],
        average: 0,
      };
    }
    gradesBySubject[subjectId].grades.push(grade);
  });

  // Calculate averages
  Object.values(gradesBySubject).forEach(subjectGrades => {
    const totalWeightedScore = subjectGrades.grades.reduce((sum, g) => 
      sum + (g.score / g.maxScore) * g.weight, 0);
    const totalWeight = subjectGrades.grades.reduce((sum, g) => sum + g.weight, 0);
    subjectGrades.average = totalWeight > 0 
      ? Math.round((totalWeightedScore / totalWeight) * 100) 
      : 0;
  });

  res.status(200).json({
    success: true,
    data: Object.values(gradesBySubject),
  });
});

// @desc    Get class grades for a subject
// @route   GET /api/grades/class/:classId/subject/:subjectId
// @access  Private
exports.getClassSubjectGrades = asyncHandler(async (req, res, next) => {
  const { term, academicYear, assignment } = req.query;

  let query = {
    class: req.params.classId,
    subject: req.params.subjectId,
  };
  if (term) query.term = term;
  if (academicYear) query.academicYear = academicYear;
  if (assignment) query.assignment = assignment;

  const grades = await Grade.find(query)
    .populate('student', 'studentId firstName lastName')
    .sort({ 'student.lastName': 1 });

  // Calculate class statistics
  const scores = grades.map(g => (g.score / g.maxScore) * 100);
  const stats = {
    count: grades.length,
    average: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    highest: scores.length > 0 ? Math.round(Math.max(...scores)) : 0,
    lowest: scores.length > 0 ? Math.round(Math.min(...scores)) : 0,
  };

  res.status(200).json({
    success: true,
    stats,
    data: grades,
  });
});

// @desc    Get report card data for a student
// @route   GET /api/grades/report-card/:studentId
// @access  Private
exports.getReportCard = asyncHandler(async (req, res, next) => {
  const { term, academicYear } = req.query;

  if (!term || !academicYear) {
    return res.status(400).json({
      success: false,
      message: 'Term and academic year are required',
    });
  }

  const grades = await Grade.find({
    student: req.params.studentId,
    term,
    academicYear,
  })
    .populate('subject', 'name code type')
    .populate('student', 'studentId firstName lastName class')
    .populate('class', 'name')
    .sort({ 'subject.name': 1 });

  // Group by subject and calculate averages
  const subjectGrades = {};
  grades.forEach(grade => {
    const subjectId = grade.subject._id.toString();
    if (!subjectGrades[subjectId]) {
      subjectGrades[subjectId] = {
        subject: grade.subject,
        assessments: [],
        totalScore: 0,
        totalMaxScore: 0,
      };
    }
    subjectGrades[subjectId].assessments.push({
      assignment: grade.assignment,
      type: grade.assignmentType,
      score: grade.score,
      maxScore: grade.maxScore,
      grade: grade.grade,
      date: grade.date,
    });
    subjectGrades[subjectId].totalScore += grade.score;
    subjectGrades[subjectId].totalMaxScore += grade.maxScore;
  });

  // Calculate final grades
  const reportData = Object.values(subjectGrades).map(sg => ({
    subject: sg.subject,
    assessments: sg.assessments,
    finalPercentage: Math.round((sg.totalScore / sg.totalMaxScore) * 100),
    finalGrade: calculateLetterGrade((sg.totalScore / sg.totalMaxScore) * 100),
  }));

  // Overall average
  const overallPercentage = reportData.length > 0
    ? Math.round(reportData.reduce((sum, r) => sum + r.finalPercentage, 0) / reportData.length)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      student: grades[0]?.student,
      class: grades[0]?.class,
      term,
      academicYear,
      subjects: reportData,
      overallPercentage,
      overallGrade: calculateLetterGrade(overallPercentage),
    },
  });
});

// Helper function to calculate letter grade
function calculateLetterGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'A-';
  if (percentage >= 75) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 65) return 'B-';
  if (percentage >= 60) return 'C+';
  if (percentage >= 55) return 'C';
  if (percentage >= 50) return 'C-';
  if (percentage >= 45) return 'D+';
  if (percentage >= 40) return 'D';
  return 'F';
}
