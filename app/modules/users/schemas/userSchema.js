var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
var TBL_USER_PROFILE = require('./userProfileSchema');

var User = db.connection.define('users', {
    email : {
        type : Sequelize.STRING,
        unique : true,
        allowNull : false,
        validate:{
            isEmail: true   
        }
    },
    password : {
        type : Sequelize.STRING,
        allowNull : false,
        validate:{
        }
    },
    email_status : {
        type : Sequelize.INTEGER,
        unique : true,
        allowNull : false,
        validate:{
        }
    },
    user_status : {
        type : Sequelize.INTEGER,
        unique : true,
        allowNull : false,
        validate:{
        }
    },
    google2fa_status : {
        type : Sequelize.INTEGER,
        allowNull : true,
        validate:{
        }
    },
    google2fa_secret_key : {
        type : Sequelize.TEXT,
        unique : true,
        allowNull : true,
        validate:{
        }
    },
    createdAt : {
        type : Sequelize.DATE,
        allowNull : false,
        validate:{
        }
    },
    updatedAt : {
        type : Sequelize.DATE,
        allowNull : false,
        validate:{
        }
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

User.hasOne(TBL_USER_PROFILE,{foreignKey:"id"});

module.exports = User;

