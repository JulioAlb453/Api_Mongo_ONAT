const express = require('express');
const router = express.Router();
const produtsController = require('../controllers/productsControllers');

router.get('/', produtsController.getProducts);
router.post('/', produtsController.createProduct);
router.get('/:id', produtsController.getProductById);
router.delete('/:id', produtsController.deleteProduct);
// router.

module.exports = router;
