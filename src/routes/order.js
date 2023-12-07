const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')
const checkBlockedAccount = require('../app/middlewares/checkBlockedAccount')
const checkRoleAccount = require('../app/middlewares/checkRoleAccount')

//lỗi lạ POS trong profile viết hoa nhưng trong code viết thường
const orderControllers = require('../app/controllers/OrderControllers');

router.get('/',checkBlockedAccount,getUsername, orderControllers.index);
router.get('/view/:id',checkBlockedAccount,getUsername, orderControllers.showOrderDetail);

module.exports = router;