const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsControllers');

router.get('/', eventsController.getEvents);
router.post('/', eventsController.createEvent);
router.get('/:id', eventsController.getEventById);
router.delete('/:id', eventsController.deleteEvent);
// router.

module.exports = router;
