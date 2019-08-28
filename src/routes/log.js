const user = require('../models/user');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = function (app) {
    //LOGIN DE CLIENTE WEB
    app.post('/logW', (req, res) => {
        user.getUserByUsername(req.body.Username, (err, data) => {
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
                        if (data[0].webApp != '1'){
                            res.json({ 
                                success: false,
                                message: 'El usuario no tiene permisos para acceder a este sitio.',
                            });
                        }else{
                            const payload = {
                                idUsuario: data[0].id_user,
                                username: data[0].username,
                                idEmpresa: data[0].id_empresa,
                                Empresa: data[0].nombre_empresa,
                            };
                            var token = jwt.sign(payload, app.get('secret'), {
                                expiresIn: '10080m' // expires in half an hour
                            });
                            var expiraEn = new Date();
                            expiraEn.setMinutes(expiraEn.getMinutes() + 10080);
                            res.json({
                                success: true,
                                message: 'Bienvenido',
                                empresa: data[0].empresa,
                                username: data[0].username,
                                expiresIn: expiraEn,
                                token: token,
                                dominio: data[0].dominio,
                            });
                        }
                    }
                }
            }
        });
    });

    


    //LOGIN DE CLIENTE MOVILE APP
    app.post('/logM', (req, res) => {
        user.getUserByUsername(req.body.Username, (err, data) => {
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
                        if (data[0].webApp != '1'){
                            res.json({ 
                                success: false,
                                message: 'El usuario no tiene permisos para acceder a este sitio.',
                            });
                        }else{
                            const payload = {
                                idUsuario: data[0].id_user,
                                username: data[0].username,
                                idEmpresa: data[0].id_empresa,
                                Empresa: data[0].nombre_empresa,
                            };
                            var token = jwt.sign(payload, app.get('secret'), {
                                //expiresIn: '10080m' // expires in half an hour
                            });
                            var expiraEn = new Date();
                            expiraEn.setMinutes(expiraEn.getMinutes() + 10080);
                            res.json({
                                success: true,
                                message: 'Bienvenido',
                                empresa: data[0].empresa,
                                username: data[0].username,
                                expiresIn: expiraEn,
                                token: token,
                                Dominio: data[0].dominio,
                            });
                        }
                    }
                }
            }
        });
    });

    //LOGIN DEL ADMINISTRADOR
    app.post('/adminlog', (req, res) => {
        user.getUserByAdminUsername(req.body.Username, (err, data) => {
            if (err){
                res.status(500).send({message: 'Error al comprobar usuario'});
            }else{
                var array = data[0];
                if (!array || array.length <= 0 ) {
                    //res.json({ success: false, message: 'Authentication failed. User not found.' });
                    res.json({ 
                        success: false,
                        message: 'El administrador indicado no existe',
                    });
                } else if (data) {
                    if (data[0].admin_pass != req.body.Password) {
                        res.json({ 
                            success: false,
                            message: 'La contraseña indicada no es correcta',
                        });
                    } else{
                        const payload = {
                            idUsuario: data[0].id_admin
                        };
                        var token = jwt.sign(payload, app.get('secret'), {
                            expiresIn: '180m' // expires in 3 hours
                        });
                        var expiraEn = new Date();
                        expiraEn.setMinutes(expiraEn.getMinutes() + 180);
                        res.json({
                            success: true,
                            message: 'Bienvenido',
                            admin: data[0].admin_username,
                            expiresIn: expiraEn,
                            token: token,
                        });
                    }
                }
            }
        });
    });

}