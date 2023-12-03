const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')

//lỗi lạ POS trong profile viết hoa nhưng trong code viết thường
const orderControllers = require('../app/controllers/OrderControllers');

router.get('/',getUsername, orderControllers.index);
router.get('/view/:id',getUsername, orderControllers.showOrderDetail);

module.exports = router;