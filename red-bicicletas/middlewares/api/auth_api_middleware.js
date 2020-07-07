const jwt = require('jsonwebtoken');

module.exports = function authApi(req, res, next){
    jwt.verify(req.headers['x-acces-token'], req.app.get('secretKey'), function(error, decoded){
        if(error){
            res.json({
                status: 'error', 
                message: error.message,
                data: null
            });
        }else{
            req.body.userId =  decoded.id;
            console.log('jwt verify: ' + decoded);
            next();
        }
    });
}