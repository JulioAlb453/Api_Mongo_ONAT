const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsControllers');
const authenticate = require('../middleware/authMiddleware');

router.get('/',authenticate, eventsController.getEvents);
router.post('/',authenticate, eventsController.createEvent);
router.get('/:id',authenticate, eventsController.getEventById);
router.delete('/:id',authenticate, eventsController.deleteEvent);
// router.

module.exports = router;
