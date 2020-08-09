var express = require('express'),
app = express(),
port = process.env.PORT || 3000,
apiRouter = require('./api/routes'),
bodyParser = require('body-parser');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", apiRouter);

app.listen(port);

console.log('Scraping Server started on: ' + port);