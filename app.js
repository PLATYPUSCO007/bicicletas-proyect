require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const {PromiseHelper} = require('./helpers');

var indexRouter = require('./routes/index_route');
var usersRouter = require('./routes/users_route');
var bicicletasRouter = require('./routes/bicicletas_route');
const tokenRouter = require('./routes/token_route');
const {Token, Usuario} = require('./models');


var AuthApi = require('./routes/api/auth_route');
var bicicletasApi = require('./routes/api/bicicleta_route');
var usuariosApi = require('./routes/api/usuario_route');
var reservasApi = require('./routes/api/reservas_route');

const {AuthMiddleware} = require('./middlewares');
const {AuthApiMiddleware} = require('./middlewares/api');
const { assert } = require('console');

let store;
if(process.env.NODE_ENV === 'development'){
  store = new session.MemoryStore;
}else{
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  });
  store.on('error', function(error){
    assert.ifError(error);
    assert.ok(false);
  });
}

var app = express();

app.set('secretKey', 'janjvi_sd!234*msh');

app.use(session({
  cookie: {
    maxAge: 240 * 60 * 60 * 1000
  },
  store: store,
  saveUninitialized: true,
  resave: true,
  secret: 'Ricardo_Bicicletas234!12+*+l234lnpT'
}));

const url = process.env.MONGO_URI;
mongoose.connect(url, {useNewUrlParser: true,  useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function (req, res){  
  res.render('session/login');
});

app.post('/login', function (req, res, next){  
  passport.authenticate('local', function (error, usuario, info) {  
    if(error) return next(error);
    if(!usuario) return res.render('session/login', {info});
    req.logIn(usuario, async function(error){
      if(error) return next(error);
      const [tokenError, token] = await PromiseHelper.handle(Token.findOne({_userId: usuario._id}));
      if(token){
        console.log(token);
        return res.render('index', {title: 'Ricardo Enciso', user: {confirm: 'User Login'}, token: token.token});
      }
      return res.render('index', {title: 'Ricardo Enciso', user: {confirm: 'User Login'}, token: {}});
    });
  })(req, res, next);
});

app.get('/logout', function (req, res) {  
  req.logOut();
  res.redirect('/');
});

app.get('/forgotPassword', function (req, res) {  
  res.render('session/forgotPassword');
});

app.post('/forgotPassword', async function (req, res, next) {  
  const user = await Usuario.findOne({email: req.body.email}).catch(e => {return next(e)});
  if(!user){
    return res.render('session/forgotPassword', {info: {message: `No existe el usuario ${req.body.email}`}});
  }

  user.resetPassword(function(error){
    if(error) return next(error);
  });

  res.render('session/forgotPasswordMessage');
});

app.get('/resetPassword/:token', async function(req, res, next){
  const token = await Token.findOne({token: req.params.token});
  if(!token){
    return res.status(400).send({type: 'not-verified', msg: 'No existe el token'});
  }

  const user = await Usuario.findById(token._userId);
  if(!user){
    return res.status(400).send({msg: 'No hay un usuario asociado a este token'});
  }
  res.render('session/resetPassword', {errors: {}, usuario: user});
});

app.post('/resetPassword/', async function(req, res, next){
  if(req.body.password != req.body.confirm_password){
    res.render('session/resetPassword', {errors: {confirm_password: {message: 'No coinciden las contraseñas'}}});
    return;
  }
  const user = await Usuario.findOne({email: req.body.email});
  user.password = req.body.password;
  user.confirm_password = req.body.confirm_password;
  let [userError, userSave] = await PromiseHelper.handle(user.save());
  if(userError){
    res.render('session/resetPassword', {errors: {rejectUser: {message: 'Error en el proceso, intentelo nuevamente'}}});
    return;
  }
  
  if(userSave)
    res.render('session/login');
});

app.use('/',  enviroenment, indexRouter);
app.use('/usuarios', usersRouter);
app.use('/bicicletas', AuthMiddleware, bicicletasRouter);
app.use('/token', tokenRouter);

app.use('/policies', function(req, res){
  res.render('policies');
});

app.use('/google12b13b5fd72ee2fe', function(req, res){
  res.sendfile('public/google12b13b5fd72ee2fe.html');
});

app.get('/auth/google', 
        passport.authenticate('google', 
        {
          scope: ['https://www.googleapis.com/auth/plus.login',
                  'https://www.googleapis.com/auth/plus.profile.emails.read']
        })
);

app.get('/auth/google/callback', passport.authenticate('google', 
  {
    successRedirect: '/',
    failureRedirect: '/error'
  })
);

app.use('/api' , bicicletasApi);
app.use('/api/usuarios', usuariosApi);
app.use('/api/reservas' , reservasApi);
app.use('/api/auth', AuthApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function enviroenment(req, res, next) {  
  if(process.env.NODE_ENV == 'production'){
    console.log('Produccion');
  }else{
    console.log(process.env.NODE_ENV);
  }
  next();
}

module.exports = app;
