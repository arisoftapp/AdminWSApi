const user = require('../models/login_invmobile');
module.exports = function (app) {

    app.get('/loginInv', (req, res) => {
        var usuario = req.body.usuario;
        var contra = req.body.contra;
        user.getValidarUsuario(usuario, (err, data) => {
            if (err){
                res.status(500).send({success:false,
                    message: 'Error al comprobar usuario'});
            }
            else{
            
                if(data.length<1)
                {
                    res.json({success:false,
                        mensaje:"usuario incorrecto"});
                }
                else
                {
                    if(data[0].contra!=contra)
                    {
                        res.json({success:false,
                            mensaje:"contraseña incorrecta"});
                    }
                    else
                    { 
                        res.json({success:true,
                            usuario: data,});
                    }

                }

            }
        });
    });



}