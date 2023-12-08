const express = require('express');
const router = express.Router();
const {check, validationResult } = require('express-validator')
const getUsername = require('../app/middlewares/setGlobaleUsername')
const checkBlockedAccount = require('../app/middlewares/checkBlockedAccount')
const checkRoleAccount = require('../app/middlewares/checkRoleAccount')

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


router.get('/',checkBlockedAccount,checkRoleAccount,getUsername, staffControllers.index);
router.get('/create-staff',checkBlockedAccount,checkRoleAccount,getUsername, staffControllers.createStaffInterface);
router.post('/create-staff',upload.single('image'), validator ,getUsername, staffControllers.createStaff);
router.delete('/delete/:id',getUsername,staffControllers.deleteStaff)
router.get('/edit/:id',checkBlockedAccount,checkRoleAccount,getUsername,staffControllers.showEditStaff)
router.put('/edit/:id',upload.single('image'),getUsername,staffControllers.editStaff)
router.put('/profile/edit/:id',upload.single('image'),getUsername,staffControllers.editProfile)
router.post('/resend/:email',getUsername,staffControllers.resendEmailStaff)
router.post('/block/:id',getUsername,staffControllers.blockStaff)
router.post('/search',getUsername,staffControllers.searchStaff)
router.get('/admin',getUsername,staffControllers.showAdmin)

module.exports = router;
