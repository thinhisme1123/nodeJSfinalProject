const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')
const checkBlockedAccount = require('../app/middlewares/checkBlockedAccount')
const checkRoleAccount = require('../app/middlewares/checkRoleAccount')

//lỗi lạ POS trong profile viết hoa nhưng trong code viết thường
const posControllers = require('../app/controllers/SaleControllers');

router.post('/search',getUsername, posControllers.searchProduct);
router.post('/pos-adding/:id',getUsername, posControllers.addPOSProductCart);
router.delete('/delete/:id',getUsername, posControllers.deletePOSProduct);
router.post('/checkNumber',getUsername, posControllers.checkPhoneNumber);
router.post('/createCustomer',getUsername, posControllers.createCustomer);
router.post('/createOrder',getUsername, posControllers.createOrder);
router.post('/createInvoice',getUsername, posControllers.createInvoice);
router.get('/invoice/:id',checkBlockedAccount,getUsername, posControllers.showInvoice);

module.exports = router;
