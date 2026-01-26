const Event = require('../models/Event');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
exports.getEvents = asyncHandler(async (req, res, next) => {
  const { search, startDate, endDate, page = 1, limit = 10 } = req.query;

  let query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by date range
  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = new Date(startDate);
    }
    if (endDate) {
      query.date.$lte = new Date(endDate);
    }
  }

  const total = await Event.countDocuments(query);
  const events = await Event.find(query)
    .populate('createdBy', 'name email')
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: events.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: events,
  });
});

// @desc    Get events by date range (for calendar)
// @route   GET /api/events/calendar
// @access  Private
exports.getEventsForCalendar = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Please provide startDate and endDate query parameters',
    });
  }

  const events = await Event.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  })
    .select('title date image')
    .sort({ date: 1 });

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  // Increment views
  event.views += 1;
  await event.save();

  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc    Create event
// @route   POST /api/events
// @access  Private
exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: event,
  });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  // Check if user is the creator or admin
  if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this event',
    });
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  // Check if user is the creator or admin
  if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this event',
    });
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
  });
});

