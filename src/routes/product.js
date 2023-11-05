const express = require('express');
const router = express.Router();

const productControllers = require('../app/controllers/ProductControllers');

router.get('/', productControllers.index);
router.get('/create-product', productControllers.createProduct);

module.exports = router;
