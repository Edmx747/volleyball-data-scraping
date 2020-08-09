var express = require('express');
var router = express.Router();
const Calendar = require('../../controllers/calendar.controller')

router.get('/',Calendar.getCalendar);

module.exports = router;