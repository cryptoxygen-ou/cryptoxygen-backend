var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var soft = db.connection.define('softcap', {
    tokens : {
        type : Sequelize.STRING
    },
    text : {
        type : Sequelize.STRING
    },
    status : {
        type : Sequelize.INTEGER
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


module.exports = soft;

