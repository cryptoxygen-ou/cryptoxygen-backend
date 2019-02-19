var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var address_allot = db.connection.define('address_allotment_users', {
    user_id : {
        type : Sequelize.INTEGER
    },
    address_id : {
        type : Sequelize.INTEGER
    },
    address_type : {
        type : Sequelize.STRING
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


module.exports = address_allot;

