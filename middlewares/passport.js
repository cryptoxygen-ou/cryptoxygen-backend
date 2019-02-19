var config = require('./../config/config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var db = require('../config/db');
var User = require('../app/modules/users/schemas/userSchema');

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest  = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.SECRET;
    
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    
     User.findById(jwt_payload.id)
        .then(user => {
        
      if(user){
        return done(null, user);
      }else{
        return done(null, false);
      }
      }).catch((err) => { 
        return done(err, false);
      });
    }));
}