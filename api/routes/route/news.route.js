var express = require('express');
var router = express.Router();
const News = require('../../controllers/news.controller')

router.get('/:page',News.getNewsPage);

module.exports = router;
