const mongoose = require('mongoose');
const {Reserva} = require('./index');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const uniqueValidator = require('mongoose-unique-validator');
const saltRounds = 10;
const Schema = mongoose.Schema;

const Token = require('./token_model');
const mailer = require('../mailer/sendmails');


const validateEmail = function(email){ 
    const re = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    return re.test(email);
    //return true;
}

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El mail es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'ingrese un mail valido'],
        match: [/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/]
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verify: {
        type: Boolean,
        default: false
    },
    googleId: String,
    facebookId: String
});


usuarioSchema.plugin(uniqueValidator, {message: 'el {PATH} ya existe con otro usuario'});

usuarioSchema.pre('save', function(next){
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.methods.send_mail = function (cb) {  
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {  
        if(err)
            return console.log(err);
        const mail_options = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Verificacion de cuenta',
            text: 'Hola\n\n' + 'Para verificar su cuenta haga click en el siguiente enlace: \n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '.\n'
        };

        mailer.sendMail(mail_options, function(error){
            if(error){
                return console.log(error.message);
            }
            console.log('A verification mail has been sent to ' + email_destination + '.');
        });
    });
}

usuarioSchema.methods.resetPassword = function(cb){  
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {  
        if(err)
            return console.log(err);
        const mail_options = {
            from: 'william.enciso@cun.edu.co',
            to: email_destination,
            subject: 'Red Bicicletas - Reseteo de password',
            text: 'Hola\n\n' + 'Para resetear su password haga click en el siguiente enlace: \n' + 'http://localhost:3000' + '\/resetPassword\/' + token.token + '.\n'
        };

        mailer.sendMail(mail_options, function(error){
            if(error){
                return console.log(error.message);
            }
            console.log('A recovery pass mail has been sent to ' + email_destination + '.');
        });
    });
}

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition, cb) {  
    const self = this;
    console.log(condition);
    self.findOne({
        $or:[
            {'googleId': condition.id}, {'email': condition.emails[0].value}
        ] 
    },
        (error, result) => {
            if(result){
                cb(error, result);
            }else{
                console.log('---CONDITION----');
                console.log(condition);
                let values = {};
                values.googleId = condition.id;
                values.email = condition.emails[0].value;
                values.nombre = condition.displayName || 'SIN NOMBRE';
                values.verify = true;
                values.password = condition._json.etag;
                console.log('----VALUES----');
                console.log(values);
                self.create(values, (error, result)=>{
                    if(error) console.log(error);
                    return cb(error, result);
                })
                
            }
        }
    );
}

usuarioSchema.statics.findOneOrCreateByFacebook = function findOneOrCreate(condition, cb) {  
    const self = this;
    console.log(condition);
    self.findOne({
        $or:[
            {'facebookId': condition.id}, {'email': condition.emails[0].value}
        ] 
    },
        (error, result) => {
            if(result){
                cb(error, result);
            }else{
                console.log('---CONDITION----');
                console.log(condition);
                let values = {};
                values.facebookId = condition.id;
                values.email = condition.emails[0].value;
                values.nombre = condition.displayName || 'SIN NOMBRE';
                values.verify = true;
                values.password = crypto.randomBytes(16).toString('hex');
                console.log('----VALUES----');
                console.log(values);
                self.create(values, (error, result)=>{
                    if(error) console.log(error);
                    return cb(error, result);
                })
                
            }
        }
    );
}

module.exports = mongoose.model('Usuario', usuarioSchema);