var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var eth_trans = db.connection.define('eth_transaction', {
    address_id : {
        type : Sequelize.INTEGER
    },
     wallet_id : {
        type : Sequelize.STRING
    },
    txid : {
        type : Sequelize.STRING
    },
    address_from : {
        type : Sequelize.STRING
    },
    amount : {
        type : Sequelize.STRING
    },
    address_to : {
        type : Sequelize.STRING
    },
    user_id : {
        type : Sequelize.INTEGER
    },
    coin : {
        type : Sequelize.STRING
    },
    type : {
        type : Sequelize.STRING
    },
    status : {
        type : Sequelize.STRING
    },
    block_id:{
        type: Sequelize.INTEGER
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


module.exports = eth_trans;

