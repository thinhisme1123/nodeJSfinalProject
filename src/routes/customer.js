const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')


const customerControllers = require('../app/controllers/CustomerControllers');

router.get('/',getUsername, customerControllers.index);
router.get('/view/:id',getUsername, customerControllers.showCustomerDetail);

module.exports = router;
