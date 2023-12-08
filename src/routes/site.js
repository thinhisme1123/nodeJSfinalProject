const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')
const checkBlockedAccount = require('../app/middlewares/checkBlockedAccount')
const checkRoleAccount = require('../app/middlewares/checkRoleAccount')

const siteControllers = require('../app/controllers/SiteControllers');

router.get('/login',siteControllers.showLogin);
router.post('/login', siteControllers.login)
router.get('/',siteControllers.index);
router.get('/view/today',siteControllers.showChartToday);
router.get('/logout',siteControllers.logout);
router.get('/profile/:id',checkBlockedAccount,getUsername,siteControllers.showProfile);
router.get('/change-password',checkBlockedAccount,siteControllers.showChangePW);
router.post('/changepassword',siteControllers.changePW);
router.get('/verify-account',siteControllers.verifyStaff);
router.get('/pos',checkBlockedAccount,siteControllers.showPOS);

module.exports = router;
