const express = require('express');
const router = express.Router();

const siteControllers = require('../app/controllers/SiteControllers');

router.get('/', siteControllers.index);
router.post('/login',siteControllers.login )

module.exports = router;
