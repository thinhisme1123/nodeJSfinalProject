const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')

const productControllers = require('../app/controllers/ProductControllers');

router.get('/',getUsername, productControllers.index);
router.get('/create-product',getUsername, productControllers.showCreateProduct);
router.post('/create-product',getUsername, productControllers.createProduct);

module.exports = router;
