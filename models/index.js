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
    tags:{
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
      set: function (value) {
        var tagsAsAnArray = value.split(',');
        this.setDataValue('tags', tagsAsAnArray);
      }
    }

},  {
    getterMethods:{
    route: function () {
      // console.log("in hook", this);
      return '/wiki/'+ this.urlTitle;}

  }
  // classMethods {
  //   findByTag: function (tag) {
  //     return this.findAll({
  //       where:{
  //         tag:{
  //           $contains: [tag]
  //         }
  //       }
  //     })
  //   }
  // }
  // instanceMethods:{
  //   findSimilar: function () {
  //     return this.constructor.findAll({
  //       where:{
  //         tag: {
  //             $overlap: this.tags
  //         },
  //         id:{
  //           $ne: this.id
  //         }
  //       }
  //     })
  //   }
  // }

}
//not currently working
// ,{
//   hooks:{
//     beforeValidate: function(page) {
//       console.log("this is happening");
//       if (page.title) {
//         page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
//       } else {
//         page.urlTitle = page.title=  Math.random().toString(36).substring(2, 7);
//       }
//     }
//   }
// }
);

Page.hook('beforeValidate',function(page) {
  if (page.title) {
    var withUnder = page.title.split(" ").join('_');
    page.urlTitle = withUnder.replace(/[^0-9a-z_]/ig, '');
    // return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    console.log("creating random title");
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
},
{
    getterMethods:{
    route: function () {
      return '/wiki/users/'+ this.id;}
  }
});

Page.belongsTo(User, {as: 'author'});

module.exports = {
  Page: Page,
  User: User
};
