var express = require('express');
var router = express.Router();
const Teams = require('../../controllers/teams.controller')

router.get('/',Teams.getTeams);
router.get('/:teamName',Teams.getTeams);

module.exports = router;