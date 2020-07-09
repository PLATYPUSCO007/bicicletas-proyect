const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {Usuario} = require('../models');
const GoogleStrategy = require('passport-google-oauth20');

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

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + '/auth/google/callback'
},
    function(accesToken, refreshToken, profile, cb){
        console.log(profile);
        Usuario.findOneOrCreateByGoogle(profile, function(error, user){
            return cb(err, user);
        });
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