var db = require('../../../../config/db');
var Sequelize = require('sequelize');
var User = require('./userSchema');

var UserProfile = db.connection.define('users_profile', {
  user_id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    validate : {
    }
  },
  f_name : {
    type : Sequelize.STRING,
    allowNull : true,
    validate : {
    }
  },
  l_name : {
    type : Sequelize.STRING,
    allowNull : true,
    validate : {
    }
  },
  phone : {
    type : Sequelize.STRING,
    allowNull : true,
    validate : {
    }
  },
  country : {
    type : Sequelize.STRING,
    allowNull : true,
    validate : {
    }  
  },
  state : {
    type : Sequelize.STRING,
    allowNull : true,
    validate : {
    }  
  },
  zipcode : {
    type : Sequelize.STRING,
    allowNull : true,
    validate : {
    }  
  },
  address : {
    type : Sequelize.TEXT,
    allowNull : true,
    validate : {
    }  
  },
  createdAt : {
    type : Sequelize.DATE,
    allowNull : true,
    validate : {
    }
     
  },
  updatedAt : {
    type : Sequelize.DATE,
    allowNull : true,
    validate : {
    },
     
  }
 
});


module.exports = UserProfile;
