const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')
const productControllers = require('../app/controllers/ProductControllers');
const checkBlockedAccount = require('../app/middlewares/checkBlockedAccount')
const checkRoleAccount = require('../app/middlewares/checkRoleAccount')
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/uploads/products'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});
const upload = multer({ storage: storage });


router.post('/search',getUsername, productControllers.searchProduct);
router.delete('/delete/:id',getUsername, productControllers.deleteProduct);
router.get('/',checkBlockedAccount,getUsername, productControllers.index);
router.get('/edit/:id',checkBlockedAccount,getUsername, productControllers.showEditProduct);
router.put('/edit/:id',upload.single('image'),getUsername, productControllers.editProduct);
router.get('/create-product',checkBlockedAccount,checkRoleAccount,getUsername, productControllers.showCreateProduct);
router.post('/create-product',upload.single('image'),getUsername, productControllers.createProduct);


module.exports = router;
