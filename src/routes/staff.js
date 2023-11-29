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
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/uploads/staffs'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});
const upload = multer({ storage: storage });

router.get('/',getUsername, staffControllers.index);
router.get('/create-staff',getUsername, staffControllers.createStaffInterface);
router.post('/create-staff',upload.single('image'), validator ,getUsername, staffControllers.createStaff);
router.delete('/delete/:id',getUsername,staffControllers.deleteStaff)
router.get('/edit/:id',getUsername,staffControllers.showEditStaff)
router.put('/edit/:id',upload.single('image'),getUsername,staffControllers.editStaff)

module.exports = router;
