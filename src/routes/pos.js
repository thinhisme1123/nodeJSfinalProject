const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')


const posControllers = require('../app/controllers/POSControllers');

router.post('/search',getUsername, posControllers.searchProduct);
router.post('/pos-adding/:id',getUsername, posControllers.addPOSProductCart);
router.delete('/delete/:id',getUsername, posControllers.deletePOSProduct);
router.post('/checkNumber',getUsername, posControllers.checkPhoneNumber);
router.post('/createCustomer',getUsername, posControllers.createCustomer);
router.post('/createOrder',getUsername, posControllers.createOrder);


module.exports = router;
