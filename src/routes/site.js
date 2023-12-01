const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')

const siteControllers = require('../app/controllers/SiteControllers');

router.get('/login',siteControllers.showLogin);
router.post('/login', siteControllers.login)
router.get('/',siteControllers.index);
router.get('/logout',siteControllers.logout);
router.get('/profile',getUsername,siteControllers.showProfile);
router.get('/change-password',siteControllers.showChangePW);
router.post('/changepassword',siteControllers.changePW);
router.get('/verify-account',  siteControllers.verifyStaff);
router.get('/pos',  siteControllers.showPOS);

module.exports = router;
