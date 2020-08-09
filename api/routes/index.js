var express = require("express"),
news = require('./route/news.route'),
calendar = require('./route/calendar.route'),
teams = require('./route/teams.route'),
player = require('./route/player.route'),
app = express();

app.use("/news", news);
app.use("/calendar", calendar);
app.use("/teams", teams);
app.use('/player', player)

module.exports = app;
