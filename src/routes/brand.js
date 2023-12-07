const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')
const brandControllers = require('../app/controllers/BrandControllers');
const checkBlockedAccount = require('../app/middlewares/checkBlockedAccount')
const checkRoleAccount = require('../app/middlewares/checkRoleAccount')
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/uploads/brands'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});
const upload = multer({ storage: storage });



router.get('/',checkBlockedAccount,getUsername, brandControllers.index);
router.get('/create-brand',checkBlockedAccount,getUsername, brandControllers.showCreateBrand);
router.post('/create-brand',upload.single('image'),getUsername, brandControllers.CreateBrand);
router.get('/edit/:id',checkBlockedAccount,upload.single('image'),getUsername, brandControllers.showEditBrand);
router.put('/edit/:id',upload.single('image'),getUsername, brandControllers.EditBrand);
router.delete('/delete/:id',getUsername, brandControllers.deleteBrand);

module.exports = router;