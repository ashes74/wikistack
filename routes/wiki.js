var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var Sequelize = require('sequelize');

router.get('/',function (req, res, next) {
  // res.send('got to GET /wiki/');

  Page.findAll().then(function(result){
    // console.log("Result:", result);
    // res.json(result);
    var pages = result.map(function(elem){
      return elem.dataValues;
    });
    console.log("Pages:", pages);
      res.render('index', {pages: pages});
  }).catch(function (err) {
    res.send(err);
  });

});

router.get('/add', function (req, res, next) {
  // res.send('got to GET/wiki/add');
  res.render('addpage');
});

router.get('/users', function(req, res, next) {
  console.log("Gettings users!");
  User.findAll().then(function(users) {
    console.log("Getting users:",users);
    // res.json(users);
    users = users.map(function(elem) {
      return elem.dataValues;
    });
    res.render('users', {users: users});
  });
});

router.get('/users/:id', function(req, res, next) {
  console.log("Gettings user!", req.params.id);
  Page.findAll({
    where:{
      authorId: req.params.id
    }
  }).then(function(articles) {
    console.log(articles);

    // res.json(articles);
    articles = articles.map(function(elem) {
      return elem.dataValues;
    });
    res.render('users', {pages: articles});
  }).catch(next);
});



router.post('/', function (req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var status = req.body.status;
  var name = req.body.name;
  var email = req.body.email;

  User.findOrCreate({
    where: {
      name: name,
      email: email
    }
  })
  .then(function (result) {
    var user = result[0];
    // console.log("User result after save:", result[0]);
    var page = Page.build({
      title: title,
      content: content,
      status: status,
      // UserId: result[0].id //becomes setAuthor
    });
      return page.save().then(function(page){
        return page.setAuthor(user);
      });
  })
  .then(function(result) {
      // console.log("Page result after save:", result);
    // res.json(result);
    console.log("Post result route:", result.route);
    res.redirect(result.route);
  }).catch(function(err) {
    res.send(err);
    console.error(err);
  });
});

router.get('/:title',function (req, res, next) {
  Page.find({
    where:{
      urlTitle:req.params.title
    }
  })

// .then(function (page) {
//   User.find({
//     where:{
//       id: page.UserId
//     }
//   }).then(function (user){
//     return{
//       userId: user.id;
//       email: user.email,
//       title: page.title,
//       content: page.content
//     }
//   })
//
// })
.then(function (result) {
    // console.log("Params title", req.params.title);
    // console.log("Result:",result.dataValues);
    res.render('wikipage', result.dataValues);
  }).catch(function (err) {
    res.send(err);
  });
  // res.render('wikipage');
});


module.exports = router;
