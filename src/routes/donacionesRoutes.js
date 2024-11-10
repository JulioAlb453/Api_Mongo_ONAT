const express = require('express');
const router = express.Router();
const donacionesController = require('../controllers/donacionesControllers')
const authenticate = require('../middleware/authMiddleware');


router.get('/obtenerDonaciones', authenticate, donacionesController.getDonaciones)
router.get('/doncionsPorId/:id', authenticate, donacionesController.getDonacionById)
router.post('/', authenticate, donacionesController.createDonacion)

module.exports = router;