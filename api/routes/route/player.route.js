var express = require('express');
var router = express.Router();
const Player = require('../../controllers/player.controller')

router.get('/:teamID&:playerID',Player.getPlayerDetails);

module.exports = router;