var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var Userkyc = db.connection.define('kyc_users', {
    user_id : {
        type : Sequelize.INTEGER,
        unique : true,
        // allowNull : false,
        validate:{
        }
    },
    f_name : {
        type : Sequelize.STRING,
        // allowNull : false,
        validate:{
        }
    },
    l_name : {
        type : Sequelize.STRING,
        // allowNull : false,
        validate:{
        }
    },
    city : {
        type : Sequelize.STRING,
        // allowNull : false,
        validate:{
        }
    },
    state : {
        type : Sequelize.STRING,
        // allowNull : false,
        validate:{
        }
    },
    country : {
        type : Sequelize.STRING,
        // allowNull : false,
        validate:{
        }
    },
    address : {
        type : Sequelize.STRING,
        // allowNull : false,
        validate:{
        }
    },
    zipcode : {
        type : Sequelize.STRING,
        // allowNull : false,
        validate:{
        }
    },
    country_code_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: { }
    },
    phone : {
        type : Sequelize.STRING,
        // allowNull : false,
        validate:{
        }
    },
    document_upload : {
        type : Sequelize.STRING,
        // allowNull : false,
        validate:{
        }
    },
    selfie_upload : {
        type : Sequelize.STRING,
        // allowNull : false,
        validate:{
        }
    },
    document_type : {
        type : Sequelize.STRING,
        // allowNull : false,
        validate:{
        }
    },
    kyc_status : {
        type : Sequelize.INTEGER,
        // unique : true,
        // allowNull : false,
        validate:{
        }
    },
    createdAt : {
        type : Sequelize.DATE,
        // allowNull : true,
        validate:{
        }
    },
    updatedAt : {
        type : Sequelize.DATE,
        // allowNull : true,
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


module.exports = Userkyc;

