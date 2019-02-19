var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var erc = db.connection.define('user_erc_wallet', {
    user_id : {
        type : Sequelize.INTEGER
    },
    address : {
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
         
          },
          afterValidate: function(user){
           
          },
          afterCreate: function(){
           
          },
          beforeCreate: function(){
           
          },
        }
});


module.exports = erc;

