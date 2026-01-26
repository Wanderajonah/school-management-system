const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Payment = require('../models/Payment');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get counts
  const [
    totalStudents,
    activeStudents,
    totalTeachers,
    activeTeachers,
    totalClasses,
    activeClasses,
  ] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ status: 'Active' }),
    Teacher.countDocuments(),
    Teacher.countDocuments({ status: 'Active' }),
    Class.countDocuments(),
    Class.countDocuments({ isActive: true }),
  ]);

  // Get today's attendance rate
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAttendance = await Attendance.find({
    date: { $gte: today, $lt: tomorrow },
  });

  let presentCount = 0;
  let totalMarked = 0;

  todayAttendance.forEach(record => {
    record.records.forEach(r => {
      totalMarked++;
      if (r.status === 'present' || r.status === 'late') {
        presentCount++;
      }
    });
  });

  const attendanceRate = totalMarked > 0 
    ? Math.round((presentCount / totalMarked) * 100) 
    : 0;

  // Get fee collection stats
  const feeStats = await Payment.aggregate([
    {
      $group: {
        _id: null,
        totalDue: { $sum: '$amountDue' },
        totalPaid: { $sum: '$amountPaid' },
      },
    },
  ]);

  const feeCollection = feeStats[0] || { totalDue: 0, totalPaid: 0 };
  const collectionRate = feeCollection.totalDue > 0
    ? Math.round((feeCollection.totalPaid / feeCollection.totalDue) * 100)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      students: {
        total: totalStudents,
        active: activeStudents,
      },
      teachers: {
        total: totalTeachers,
        active: activeTeachers,
      },
      classes: {
        total: totalClasses,
        active: activeClasses,
      },
      attendance: {
        todayRate: attendanceRate,
        present: presentCount,
        totalMarked,
      },
      fees: {
        totalDue: feeCollection.totalDue,
        totalPaid: feeCollection.totalPaid,
        collectionRate,
      },
    },
  });
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
exports.getRecentActivities = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;

  // Get recent students
  const recentStudents = await Student.find()
    .select('firstName lastName createdAt')
    .sort({ createdAt: -1 })
    .limit(3);

  // Get recent teachers
  const recentTeachers = await Teacher.find()
    .select('firstName lastName createdAt')
    .sort({ createdAt: -1 })
    .limit(2);

  // Get recent attendance markings
  const recentAttendance = await Attendance.find()
    .select('date class createdAt')
    .populate('class', 'name')
    .sort({ createdAt: -1 })
    .limit(3);

  // Get recent payments
  const recentPayments = await Payment.find({
    'paymentHistory.0': { $exists: true },
  })
    .select('student paymentHistory')
    .populate('student', 'firstName lastName')
    .sort({ 'paymentHistory.paymentDate': -1 })
    .limit(2);

  // Combine and format activities
  const activities = [];

  recentStudents.forEach(s => {
    activities.push({
      type: 'student',
      action: 'New student registered',
      name: `${s.firstName} ${s.lastName}`,
      timestamp: s.createdAt,
    });
  });

  recentTeachers.forEach(t => {
    activities.push({
      type: 'teacher',
      action: 'New teacher added',
      name: `${t.firstName} ${t.lastName}`,
      timestamp: t.createdAt,
    });
  });

  recentAttendance.forEach(a => {
    activities.push({
      type: 'attendance',
      action: 'Attendance marked',
      name: a.class?.name || 'Unknown class',
      timestamp: a.createdAt,
    });
  });

  recentPayments.forEach(p => {
    if (p.student) {
      activities.push({
        type: 'payment',
        action: 'Payment received',
        name: `${p.student.firstName} ${p.student.lastName}`,
        timestamp: p.paymentHistory[p.paymentHistory.length - 1]?.paymentDate,
      });
    }
  });

  // Sort by timestamp and limit
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.status(200).json({
    success: true,
    data: activities.slice(0, limit),
  });
});

// @desc    Get attendance overview for chart
// @route   GET /api/dashboard/attendance-overview
// @access  Private
exports.getAttendanceOverview = asyncHandler(async (req, res, next) => {
  const days = parseInt(req.query.days) || 7;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const attendanceData = await Attendance.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
      },
    },
    { $unwind: '$records' },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          status: '$records.status',
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.date',
        statuses: {
          $push: {
            status: '$_id.status',
            count: '$count',
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Format data for chart
  const chartData = attendanceData.map(day => {
    const data = { date: day._id, present: 0, absent: 0, late: 0 };
    day.statuses.forEach(s => {
      data[s.status] = s.count;
    });
    data.total = data.present + data.absent + data.late;
    data.rate = data.total > 0 ? Math.round(((data.present + data.late) / data.total) * 100) : 0;
    return data;
  });

  res.status(200).json({
    success: true,
    data: chartData,
  });
});

// @desc    Get class-wise student distribution
// @route   GET /api/dashboard/class-distribution
// @access  Private
exports.getClassDistribution = asyncHandler(async (req, res, next) => {
  const distribution = await Student.aggregate([
    { $match: { status: 'Active' } },
    {
      $group: {
        _id: '$class',
        count: { $sum: 1 },
      },
    },
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
        count: 1,
      },
    },
    { $sort: { className: 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: distribution,
  });
});

// @desc    Get student gender distribution
// @route   GET /api/dashboard/gender-distribution
// @access  Private
exports.getGenderDistribution = asyncHandler(async (req, res, next) => {
  console.log('getGenderDistribution called');
  
  const distribution = await Student.aggregate([
    { $match: { status: 'Active' } },
    {
      $group: {
        _id: '$gender',
        count: { $sum: 1 },
      },
    },
  ]);

  console.log('Distribution result:', distribution);

  // Format the response with default values
  const result = {
    Male: 0,
    Female: 0,
    Other: 0,
  };

  distribution.forEach(item => {
    const gender = item._id;
    if (gender && result.hasOwnProperty(gender)) {
      result[gender] = item.count;
    }
  });

  const total = result.Male + result.Female + result.Other;

  const responseData = {
    ...result,
    total,
    malePercentage: total > 0 ? Math.round((result.Male / total) * 100) : 0,
    femalePercentage: total > 0 ? Math.round((result.Female / total) * 100) : 0,
    otherPercentage: total > 0 ? Math.round((result.Other / total) * 100) : 0,
  };

  console.log('Sending response:', responseData);

  res.status(200).json({
    success: true,
    data: responseData,
  });
});
