const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = asyncHandler(async (req, res, next) => {
  const { class: classId, date, startDate, endDate, term } = req.query;

  let query = {};

  if (classId) {
    query.class = classId;
  }

  if (date) {
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);
    query.date = { $gte: queryDate, $lt: nextDay };
  }

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (term) {
    query.term = term;
  }

  const attendance = await Attendance.find(query)
    .populate('class', 'name')
    .populate('subject', 'name code')
    .populate('records.student', 'studentId firstName lastName')
    .populate('markedBy', 'name')
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance,
  });
});

// @desc    Get single attendance record
// @route   GET /api/attendance/:id
// @access  Private
exports.getAttendanceById = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id)
    .populate('class', 'name')
    .populate('subject', 'name code')
    .populate('records.student', 'studentId firstName lastName email')
    .populate('markedBy', 'name');

  if (!attendance) {
    return res.status(404).json({
      success: false,
      message: 'Attendance record not found',
    });
  }

  res.status(200).json({
    success: true,
    data: attendance,
  });
});

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private
exports.markAttendance = asyncHandler(async (req, res, next) => {
  const { date, class: classId, subject, records, term, academicYear } = req.body;

  // Check if attendance already exists for this date and class
  const existingAttendance = await Attendance.findOne({
    date: new Date(date),
    class: classId,
    subject: subject || null,
  });

  if (existingAttendance) {
    // Update existing attendance
    existingAttendance.records = records;
    existingAttendance.markedBy = req.user._id;
    await existingAttendance.save();

    return res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: existingAttendance,
    });
  }

  // Create new attendance
  const attendance = await Attendance.create({
    date: new Date(date),
    class: classId,
    subject,
    records,
    markedBy: req.user._id,
    term,
    academicYear,
  });

  res.status(201).json({
    success: true,
    message: 'Attendance marked successfully',
    data: attendance,
  });
});

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private
exports.updateAttendance = asyncHandler(async (req, res, next) => {
  let attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return res.status(404).json({
      success: false,
      message: 'Attendance record not found',
    });
  }

  attendance = await Attendance.findByIdAndUpdate(
    req.params.id,
    { ...req.body, markedBy: req.user._id },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: attendance,
  });
});

// @desc    Delete attendance
// @route   DELETE /api/attendance/:id
// @access  Private (Admin)
exports.deleteAttendance = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return res.status(404).json({
      success: false,
      message: 'Attendance record not found',
    });
  }

  await attendance.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get attendance stats for a class
// @route   GET /api/attendance/stats/:classId
// @access  Private
exports.getAttendanceStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1));
  const end = endDate ? new Date(endDate) : new Date();

  const stats = await Attendance.aggregate([
    {
      $match: {
        class: req.params.classId,
        date: { $gte: start, $lte: end },
      },
    },
    { $unwind: '$records' },
    {
      $group: {
        _id: '$records.status',
        count: { $sum: 1 },
      },
    },
  ]);

  const formattedStats = {
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
  };

  stats.forEach((stat) => {
    formattedStats[stat._id] = stat.count;
  });

  const total = Object.values(formattedStats).reduce((a, b) => a + b, 0);
  formattedStats.total = total;
  formattedStats.attendanceRate = total > 0 
    ? Math.round(((formattedStats.present + formattedStats.late) / total) * 100) 
    : 0;

  res.status(200).json({
    success: true,
    data: formattedStats,
  });
});

// @desc    Get student attendance report
// @route   GET /api/attendance/student/:studentId
// @access  Private
exports.getStudentAttendance = asyncHandler(async (req, res, next) => {
  const { term, academicYear } = req.query;

  let matchQuery = {
    'records.student': req.params.studentId,
  };

  if (term) matchQuery.term = term;
  if (academicYear) matchQuery.academicYear = academicYear;

  const attendance = await Attendance.find(matchQuery)
    .select('date records')
    .sort({ date: -1 });

  // Filter records to only include the specific student
  const studentRecords = attendance.map((record) => ({
    date: record.date,
    status: record.records.find(
      (r) => r.student.toString() === req.params.studentId
    )?.status,
  }));

  // Calculate summary
  const summary = {
    present: studentRecords.filter((r) => r.status === 'present').length,
    absent: studentRecords.filter((r) => r.status === 'absent').length,
    late: studentRecords.filter((r) => r.status === 'late').length,
    excused: studentRecords.filter((r) => r.status === 'excused').length,
  };
  summary.total = studentRecords.length;
  summary.attendanceRate = summary.total > 0
    ? Math.round(((summary.present + summary.late) / summary.total) * 100)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      records: studentRecords,
      summary,
    },
  });
});

// @desc    Get today's attendance status
// @route   GET /api/attendance/today
// @access  Private
exports.getTodayAttendance = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const attendance = await Attendance.find({
    date: { $gte: today, $lt: tomorrow },
  }).populate('class', 'name');

  // Get total active students
  const totalStudents = await Student.countDocuments({ status: 'Active' });

  // Calculate today's stats
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;

  attendance.forEach((record) => {
    record.records.forEach((r) => {
      if (r.status === 'present') presentCount++;
      else if (r.status === 'absent') absentCount++;
      else if (r.status === 'late') lateCount++;
    });
  });

  res.status(200).json({
    success: true,
    data: {
      classesMarked: attendance.length,
      totalStudents,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      attendanceRate: totalStudents > 0
        ? Math.round(((presentCount + lateCount) / totalStudents) * 100)
        : 0,
    },
  });
});
