const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsControllers');
const authenticate = require('../middleware/authMiddleware');

router.get('/obtenerEventos', eventsController.getEvents);
router.post('/crearEvento',authenticate, eventsController.createEvent);
router.get('/mostrarEventosPorID/:_id', eventsController.getEventById);
router.delete('/eliminarEvento/:id',authenticate, eventsController.deleteEvent);
router.put('/modificarEvento/:id', authenticate, eventsController.updateEvent)
router.get('/encontrarEventosPorOrg/:id', authenticate, eventsController.getEventsWithOrg)

module.exports = router;
