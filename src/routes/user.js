const user = require('../models/user');

module.exports = function (app) {

    app.get('/user/:username', (req, res) => {
        var username = req.params.username;
        user.getUserByUsername(username, (err, data) => {
            res.json({user: data});
        });
    });

    app.get('/iduser/:id', (req, res) => {
        var id = req.params.id;
        var empresa = req.decoded.idEmpresa;
        user.getUserById(id,empresa, (err, data) => {
            res.json({user: data});
        });
    });

    app.get('/user/dispositivos/:username', (req, res) => {
        var usuario = req.params.username;
        user.getDeviceID(usuario, (err, data) => {
            res.json({dispositivo: data});
        });
    });

    //VALIDAR CONTRASEÑA
    app.post('/checkpass', (req, res) => {
        var idEmpresa = req.decoded.idEmpresa;
        var idUser = req.decoded.idUsuario;
        user.getPass(idUser, idEmpresa, (err, data) => {
            if (err){
                res.status(500).send({message: 'Error al comprobar usuario'});
            }else{
                var array = data[0];
                if (!array || array.length <= 0 ) {
                    //res.json({ success: false, message: 'Authentication failed. User not found.' });
                    res.json({ 
                        success: false,
                        message: 'El usuario indicado no existe',
                    });
                } else if (data) {
                    if (data[0].password != req.body.Password) {
                        res.json({ 
                            success: false,
                            message: 'La contraseña indicada no es correcta',
                        });
                    } else{
                        res.json({ 
                            success: true,
                            message: 'La contraseña indicada es correcta',
                        });
                    }
                }
            }
        });
    });

}