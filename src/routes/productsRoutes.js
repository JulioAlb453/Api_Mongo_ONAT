const express = require('express');
const router = express.Router();
const produtsController = require('../controllers/productsControllers');
const authenticate = require('../middleware/authMiddleware');

router.get('/',authenticate, produtsController.getProducts);
router.post('/',authenticate, produtsController.createProduct);
router.delete('/:id',authenticate, produtsController.deleteProduct);
router.put('/:id',authenticate, produtsController.updateProduct);
 

module.exports = router;
