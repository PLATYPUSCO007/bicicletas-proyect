module.exports = function loggedIn(req, res, next){
    if(req.user){
      next();
    }else{
      console.log('Usuario no logueado');
      res.redirect('/login');
    }
  };