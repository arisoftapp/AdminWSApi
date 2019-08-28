const empresa = require('../models/empresa');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = function (app) {
    app.get('/empresa', (req, res) => {
        empresa.getEmpresas((err, data) => {
            res.json({empresas: data});
        });
    });

    app.get('/empresa/:id', (req, res) => {
        var idempresa = req.params.id;
        empresa.getEmpresa(idempresa, (err, data) => {
            res.json({empresa: data});
        });
    });

    app.get('/empresa/:id/users', (req, res) => {
        var idempresa = req.params.id;
        empresa.getUsers(idempresa, (err, data) => {
            res.json({usuarios: data});
        });
    });

    app.post('/empresa', (req, res) => {
        if (req.body.nombre_empresa && req.body.dominio){
            var empresaData = {
                id_empresa: req.body.id,
                nombre_empresa: req.body.nombre_empresa,
                dominio: req.body.dominio,
            }
            empresa.insertEmpresa(empresaData, (err,data) => {
                if (data && data.insertId){
                    res.json({
                        success: true,
                        message: 'Se ha registrado la nueva empresa con éxito',
                    })
                }else{
                    res.json({
                        success: false,
                        message: 'Se produjo un error al intentar registrar la empresa',
                    })
                }
            });
        } else{
            res.json({
                success: false,
                message: 'No se recibieron los parámetros',
            })
        }

    });
}