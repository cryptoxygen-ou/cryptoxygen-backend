var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var usr_col = db.connection.define('users_collections', {
    user_id : {
        type : Sequelize.INTEGER
    },
     coin : {
        type : Sequelize.STRING
    },
    txid : {
        type : Sequelize.STRING
    },
    amount : {
        type : Sequelize.STRING
    },
    token_value : {
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


module.exports = usr_col;

