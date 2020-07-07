const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {Usuario} = require('../models');

passport.use(new LocalStrategy(
    async function (email, password, done) {  
        const user = await Usuario.findOne({email: email}).catch(e => { return done(e)});
        if(!user){
            return done(null, false, {message: 'Email no existente o incorrecto'});
        }

        if(!user.validPassword(password)){
            return done(null, false, {message: 'Password incorrecto'});
        }

        if(!user.verify){
            return done(null, false, {message: 'Usuario no verificado'});
        }

        return done(null, user);
    }
));

passport.serializeUser(function(user, cb){
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb){
    Usuario.findById(id, function (error, usuario) {  
        cb(error, usuario);
    });
});

module.exports = passport;