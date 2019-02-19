var Sequelize = require('sequelize');
const config = require('./config');
 module.exports = {
    connection : new Sequelize( config.DATABASE_NAME, config.DATABASE_USER, config.DATABASE_PASSWORD,{
        host: config.DATABASE_HOST,
        dialect: 'mysql',
        operatorsAliases: false
    })    
}

