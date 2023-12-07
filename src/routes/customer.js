const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')
const checkBlockedAccount = require('../app/middlewares/checkBlockedAccount')
const checkRoleAccount = require('../app/middlewares/checkRoleAccount')

const customerControllers = require('../app/controllers/CustomerControllers');

router.get('/',checkBlockedAccount,getUsername, customerControllers.index);
router.get('/history',checkBlockedAccount,getUsername, customerControllers.showHistory);
router.post('/history/search',getUsername, customerControllers.searchHistory);
router.post('/search',getUsername, customerControllers.searchCustomer);
router.get('/view/:id',checkBlockedAccount,getUsername, customerControllers.showCustomerDetail);

module.exports = router;
