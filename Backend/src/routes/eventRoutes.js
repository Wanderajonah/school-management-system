const express = require('express');
const {
  getEvents,
  getEventsForCalendar,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getEvents).post(protect, createEvent);
router.route('/calendar').get(protect, getEventsForCalendar);
router.route('/:id').get(protect, getEvent).put(protect, updateEvent).delete(protect, deleteEvent);

module.exports = router;

