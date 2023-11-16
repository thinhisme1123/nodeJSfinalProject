const {check, validationResult } = require('express-validator')

const validator = [
    check('firstname').exists().withMessage('Vui lòng nhập họ người dùng')
    .notEmpty().withMessage('Không được để trống họ người dùng')
    .isLength({
        min: 6
    }).withMessage('Họ người dùng phải từ 6 ký tự'),

    check('email').exists().withMessage('Vui lòng nhập email người dùng')
    .notEmpty().withMessage('Không được để trống email người dùng')
    .isEmail().withMessage('Đây là email không hợp lệ'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
    .notEmpty().withMessage('Không được để trống mật khẩu')
    .isLength({
        min: 6
    }).withMessage('Mật khẩu phải từ 6 ký tự'),

    check('comform-password').exists().withMessage('Vui lòng xác nhận mật khẩu')
    .notEmpty().withMessage('Vui lòng nhập xác nhận mật khẩu')
    .custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('Mật khẩu không khơp')
        }
        return true;
    })
]

module.exports = validator()
