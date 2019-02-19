var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var feedback = db.connection.define('feedback', {
    title : {
        type : Sequelize.STRING
    },
    user_id : {
        type : Sequelize.INTEGER
    },
    comment : {
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


module.exports = feedback;

