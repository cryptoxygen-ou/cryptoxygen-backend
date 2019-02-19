var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var payment = db.connection.define('user_payments', {
    user_id : {
        type : Sequelize.INTEGER
    },
    transaction_id: {
        type : Sequelize.STRING
    },
    nonce: {
        type : Sequelize.STRING
    },
    location_id: {
        type : Sequelize.STRING
    },
    idempotency_key: {
        type : Sequelize.STRING
    },
    price: {
        type : Sequelize.INTEGER
    },
    erc_tokens: {
        type : Sequelize.STRING
    },
    street:{
        type: Sequelize.STRING
    },
    city:{
        type: Sequelize.STRING
    },
    state:{
        type: Sequelize.STRING
    },
    zipcode:{
        type: Sequelize.STRING
    },
    country:{
        type: Sequelize.STRING
    },
    createdAt: {
        type : Sequelize.DATE
    },
    updatedAt: {
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


module.exports = payment;

