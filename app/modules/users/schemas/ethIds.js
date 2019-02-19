var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var ethIds = db.connection.define('eth_ids', {
    user_id : {
        type : Sequelize.INTEGER,
        allowNull : false,
    },
    ethid : {
        type : Sequelize.STRING,
        allowNull : false,
    },
    createdAt : {
        type : Sequelize.DATE,
        allowNull : true,
        validate:{
        }
    },
    updatedAt : {
        type : Sequelize.DATE,
        allowNull : true,
        validate:{
        }
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


module.exports = ethIds;

