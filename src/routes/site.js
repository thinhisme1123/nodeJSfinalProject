const express = require('express');
const router = express.Router();
const getUsername = require('../app/middlewares/setGlobaleUsername')

const siteControllers = require('../app/controllers/SiteControllers');

router.get('/login',siteControllers.showLogin);
router.post('/login',siteControllers.login)
router.get('/',siteControllers.index);
router.get('/logout',siteControllers.logout);

module.exports = router;
