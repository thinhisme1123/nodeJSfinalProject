const express = require('express');
const router = express.Router();
const {check, validationResult } = require('express-validator')
const staffControllers = require('../app/controllers/StaffControllers');
const validator = [
    check('firstName').exists().withMessage('Vui lòng nhập họ người dùng')
    .notEmpty().withMessage('Không được để trống họ người dùng')
    .isLength({
        min: 2
    }).withMessage('Họ người dùng phải từ 2 ký tự'),

    check('lastName').exists().withMessage('Vui lòng nhập tên người dùng')
    .notEmpty().withMessage('Không được để trống tên người dùng')
    .isLength({
        min: 2
    }).withMessage('Tên người dùng phải từ 2 ký tự'),

    check('email').exists().withMessage('Vui lòng nhập email người dùng')
    .notEmpty().withMessage('Không được để trống email người dùng')
    .isEmail().withMessage('Đây là email không hợp lệ')
]

router.get('/', staffControllers.index);
router.get('/create-staff', staffControllers.createStaffInterface);
router.post('/create-staff', validator , staffControllers.createStaff);


module.exports = router;
