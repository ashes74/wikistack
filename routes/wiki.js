var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var Sequelize = require('sequelize');

router.get('/',function (req, res, next) {

  Page.findAll().then(function(pages){
      res.render('index', {pages:pages});
  }).catch(next);

});

router.get('/add', function (req, res, next) {
  res.render('addpage');
});

router.get('/users', function(req, res, next) {
  User.findAll().then(function(users) {
    res.render('users', {users: users});
  });
});

router.get('/users/:id', function(req, res, next) {
  // console.log("Gettings user!", req.params.id);
  Page.findAll({
    where:{
      authorId: req.params.id
    }
  }).then(function(articles) {
    res.render('users', {pages: articles});
  }).catch(next);
});



router.post('/', function (req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var status = req.body.status;
  var name = req.body.name;
  var email = req.body.email;
  var tags = req.body.tags

  var findingOrCreating = User.findOrCreate({
    where: {
      name: name,
      email: email
    }
  })
  .then(function (values) {
    return values[0];

  });
    var creatingPage = Page.create({
      title: title,
      content: content,
      status: status,
      tags: tags
      // UserId: result[0].id //becomes setAuthor
    });

    Promise.all([findingOrCreating, creatingPage ])
      .then(function(values){
        user=values[0];
        page = values[1];
        return page.setAuthor(user);

  })
  .then(function(page) {
    res.redirect(page.route);
  }).catch(next);
});

router.get('/:urlTitle',function (req, res, next) {
  var pagePromise = Page.find({
    where:{
      urlTitle:req.params.urlTitle
    }
  })
.then(function (pageFromDB) {
  page = pageFromDB;
  author = page.getAuthor().then(function (author) {
      res.render('wikipage', {page: page, author: author});
  });

  }).catch(next);
});


module.exports = router;
