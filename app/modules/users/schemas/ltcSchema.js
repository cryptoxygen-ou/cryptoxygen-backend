var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var address_ltc = db.connection.define('address_ltc', {
    address : {
        type : Sequelize.STRING
    },
    alloted : {
        type : Sequelize.INTEGER
    },
    allotted_date : {
        type : Sequelize.DATE
    },
    createdAt : {
        type : Sequelize.DATE
    },
    updatedAt : {
        type : Sequelize.DATE
    }
   },{
        hooks: {
          beforeValidate: function(){
         console.log("before validate")
          },
          afterValidate: function(user){
            console.log("after validate");
          },
          afterCreate: function(){
            console.log("after create")
          },
          beforeCreate: function(){
            console.log("before validate")
          },
        }
});


module.exports = address_ltc;

