var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var countryCode = db.connection.define('country_codes', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    iso: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { }
    },
    nicename: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { }
    },
    iso3: {
        type:Sequelize.STRING,
        allowNull: true,
        validate: { }
    },
    numcode: {
        type: Sequelize.SMALLINT,
        allowNull: true,
        defaultValue: null,
        validate: { }
    },
    phonecode: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    created_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        validate: { }
    },
    updated_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        validate: { }
    }
}, {
    hooks: {
        beforeValidate: function () {
            console.log("before validate")
        },
        afterValidate: function (user) {
            console.log("after validate");
        },
        afterCreate: function () {
            console.log("after create")
        },
        beforeCreate: function () {
            console.log("before validate")
        },
    }
});
module.exports = countryCode;