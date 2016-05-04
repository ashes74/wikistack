var Sequelize = require('sequelize');
// var db = new Sequelize('postgres://localhost:5432/wikistack');

//to turn off logging
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

var Page = db.define ('Page', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    urlTitle: {
      type: Sequelize.STRING,
      isUrl:true,
      allowNull: false,
    },

    content: {type:Sequelize.TEXT, allowNull: false},
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    status: Sequelize.ENUM('open', 'closed'),

},  {
    getterMethods:{
    route: function () {return '/wiki/'+ this.urlTitle;}
  }
});

Page.hook('beforeValidate',function(page) {
  if (page.title) {
    var withUnder = page.title.split(" ").join('_');
    page.urlTitle = withUnder.replace(/[^0-9a-z_]/ig, '');
    // return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    page.urlTitle = Math.random().toString(36).substring(2, 7);
  }
});



var User = db.define ('User', {
  name: {type: Sequelize.STRING, allowNull: false},
  email: {
    type: Sequelize.STRING,
     isEmail:true,
    allowNull: false
  }

});

Page.belongsTo(User, {as: 'author'});

module.exports = {
  Page: Page,
  User: User
};
