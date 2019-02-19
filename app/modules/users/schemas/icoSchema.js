var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var ico = db.connection.define('ico_phases', {
    ico_phase : {
        type : Sequelize.INTEGER
    },
    erc_tokens : {
        type : Sequelize.STRING
    },
    address_type : {
        type : Sequelize.STRING
    },
    ico_phase_active : {
        type : Sequelize.INTEGER
    },
   end_date : {
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


module.exports = ico;

