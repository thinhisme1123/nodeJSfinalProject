const express = require('express');
const router = express.Router();
const {check, validationResult } = require('express-validator')
const getUsername = require('../app/middlewares/setGlobaleUsername')

const staffControllers = require('../app/controllers/StaffControllers');
const validator = [
    check('email').exists().withMessage('Vui lòng nhập email người dùng')
    .notEmpty().withMessage('Không được để trống email người dùng')
    .isEmail().withMessage('Đây là email không hợp lệ')
]

router.get('/',getUsername, staffControllers.index);
router.get('/create-staff',getUsername, staffControllers.createStaffInterface);
router.post('/create-staff', validator ,getUsername, staffControllers.createStaff);


module.exports = router;
