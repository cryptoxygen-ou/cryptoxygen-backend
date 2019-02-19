var jwt = require('jsonwebtoken');
var config = require('../config');

module.exports = asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };


