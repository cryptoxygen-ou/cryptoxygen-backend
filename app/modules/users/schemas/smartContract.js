var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var smart = db.connection.define('smart_contract', {
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


module.exports = smart;

