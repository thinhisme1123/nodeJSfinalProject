const express = require('express');
const router = express.Router();

const staffControllers = require('../app/controllers/StaffControllers');

router.get('/', staffControllers.index);
router.get('/create-staff', staffControllers.createStaffInterface);
router.post('/create-staff', staffControllers.createStaff);


module.exports = router;
