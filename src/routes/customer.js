const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')


const customerControllers = require('../app/controllers/CustomerControllers');

router.get('/',getUsername, customerControllers.index);

module.exports = router;
