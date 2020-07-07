const {Usuario} = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {PromiseHelper} = require('../../helpers');

module.exports = {
    authenticate: async function (req, res, next) {  
        const [userError, user] = await PromiseHelper.handle(Usuario.findOne({email: req.body.email}));
        if(userError){
            next(userError);
        }else{
            if (user === null){
                return res.status(401).json({
                    status: 'error',
                    message: 'Las credenciales no son correctas',
                    data: null
                });
            }
            if(user != null && bcrypt.compareSync(req.body.password, user.password)){   

                const token = jwt.sign({id: user._id}, req.app.get('secretKey'), {expiresIn: '7d'});
                res.status(200).json({
                    message: 'usuario encontrado',
                    data: {usuario: user, token: token}
                });

            }else{
                res.status(401).json({
                    status: 'error',
                    message: 'Email/Password Invalidos',
                    data: null
                });
            }
        }
    },
    forgotPassword: async function (req, res, next) {  
        const [userError, user] = await Usuario.findOne({email: req.body.email});
        if(!user){
            return res.status(401).json({
                message: 'No existe el usuario',
                data: null
            });
        }
        user.resetPassword(function (error){  
            if(error){
                return next(error);
            }
            res.status(200).json({
                message: 'Se envio un mail para reestablecer la contraseña',
                data: null
            })
        });
    }
}