var morgan = require('morgan');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var swig = require('swig');
var routes = require('./models/');
var path = require('path');
var models = require('./models');
var wikiRouter = require('./routes/wiki');





// point res.render to the proper directory
app.set('views', __dirname + '/views');
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files
// have it use swig to do so
app.engine('html', swig.renderFile);
// turn of swig's caching
swig.setDefaults({cache: false});


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/wiki', wikiRouter);

// ... other stuff
var publicDir = path.join(__dirname, '/public');
var staticMiddleware = express.static(publicDir);
app.use(staticMiddleware);

var models = require('./models');
app.get('/', function (req, res, next) {
  res.render('index');
});

//create tables from schema (async)->Promise
// models.User.sync({force:true})
models.User.sync()
.then(function () {
    // return models.Page.sync({force:true});
    return models.Page.sync();
})
.then(function () {
  //open server
  var server = app.listen(8888, function () {
    console.log('listening on port 8888');
  });
})
.catch(console.error);

app.use('/:page',function (req, res, next) {
  res.redirect('/wiki/'+req.params.page);
});
app.use(function (req, res, next) {
  var err = new Error('not found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status|| 500).send(err);
});
