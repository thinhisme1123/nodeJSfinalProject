const express = require('express');
const router = express.Router();

const customerControllers = require('../app/controllers/CustomerControllers');

router.get('/', customerControllers.index);

module.exports = router;
