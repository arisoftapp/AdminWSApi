const conteo = require('../models/conteo');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = function (app) {
    app.get('/conteos', (req, res) => {
        var idEmpresa = req.decoded.idEmpresa;
        if (idEmpresa) {
            conteo.getConteos(idEmpresa, (err, data) => {
                res.json({conteos: data});
            });
        } else {
            // if there is no token
            // return an error
            return res.status(405).send({
                success: false,
                message: 'Can not get IdEmpresa'
            });
        }
    });

    app.get('/conteos/:id', (req, res) => {
        var idConteo = req.params.id;
        var idEmpresa = req.decoded.idEmpresa;
        if (idEmpresa) {
            conteo.getConteo(idEmpresa, idConteo, (err, data) => {
                res.json({conteos: data});
            });
        } else {
            // if there is no token
            // return an error
            return res.status(405).send({
                success: false,
                message: 'Can not get IdEmpresa'
            });
    
        }
    });

    app.get('/conteo/chgstatus/:status/:conteo', (req, res) => {
        var status = req.params.status;
        var idConteo = req.params.conteo;
        var idEmpresa = req.decoded.idEmpresa;
        console.log("Empresa: " + idEmpresa);
        if (idEmpresa) {
            conteo.putConteoStatus(idEmpresa, idConteo, status, (err, data) => {
                if (err){
                    res.json({success: false});
                } else {
                    res.json({success: true});
                }
               
            });
        }
    });

    app.get('/conteoDet/:id', (req, res) => {
        var idConteo = req.params.id;
        var idEmpresa = req.decoded.idEmpresa;
        if (idEmpresa) {
            conteo.getConteoDet(idEmpresa, idConteo, (err, data) => {
                res.json({articulos: data});
            });
        } else {
            // if there is no token
            // return an error
            return res.status(405).send({
                success: false,
                message: 'Can not get IdEmpresa'
            });
    
        }
    });

    app.get('/getIdConteo', (req, res) => {
        var idEmpresa = req.decoded.idEmpresa;
        conteo.getUltimoConteo(idEmpresa, (err, data) => {
            if (data[0].ultimo === null){
                res.json({
                    success: true,
                    msg: 'Ultimo conteo',
                    ultimo: 0 + 1
                });
            } else {
                res.json({
                    success: true,
                    msg: 'Ultimo conteo',
                    ultimo: data[0].ultimo + 1
                });
            }
        });
    });

    app.post('/conteo', (req, res) => {
        var idConteo;
        var idAlm = req.body.alm;
        var idEmpresa = req.decoded.idEmpresa;
        conteo.getUltimoConteo(idEmpresa, (err, data) => {
            if (err){
                res.status(500).send({message: 'Error al obtener ID de conteo'});
            }else{
                if (data[0].ultimo === null){
                    idConteo = 1;
                } else {
                    idConteo = data[0].ultimo + 1;
                }
                const conteoData = {
                    id_conteo: idConteo,
                    id_empresa: req.decoded.idEmpresa,
                    id_usuario: req.decoded.idUsuario,
                    id_alm: req.body.alm,
                    nombre_alm: req.body.nombre_alm,
                };
        
                var conteos = req.body.params;
                var series = req.body.series;
                var valuesConteos = '';
                var valuesSeries = '';
        
                for (i = 0; i < conteos.length; i++) { 
                    var desc = conteos[i].descripcion;
                    carac = '"';
                    desc = desc.replace(carac, 'PUL');
                    desc = desc.replace(carac, 'PUL');
                    coments = conteos[i].comentario;
                    if (coments === undefined){
                        coments = "";
                    }
                    coments = coments.trim();
                    valuesConteos = valuesConteos + '(' + idEmpresa + ', ' + idConteo + ', ' + "'" + conteos[i].cod_prod +"'"+', "' + desc + '", '+ 
                    conteos[i].existencia + ', ' + conteos[i].conteo + ', ' + conteos[i].diferencia + ', "' + conteos[i].es_series + '", "' + coments;
                    
                    if (i === (conteos.length - 1)) {
                        valuesConteos = valuesConteos + '");';
                    }else {
                        valuesConteos = valuesConteos + '"),';
                    }
                }
                
                for (i = 0; i < series.length; i++){
                    valuesSeries = valuesSeries + '(' + idEmpresa + ', ' + idConteo + ', "' + series[i].cod_prod + '", "' +
                        series[i].serie + '", "' + series[i].estatus + '"';
                    if (i === (series.length - 1)) {
                        valuesSeries = valuesSeries + ');';
                    }else {
                        valuesSeries = valuesSeries + '),';
                    }
                }
                conteo.insertConteo(conteoData, (err, data) => {
                    if (data) {
                        console.log('Conteo guadado');
                        //console.log(valuesConteos);
                        conteo.insertDetConteo(valuesConteos, (err, data) => {
                            if (data) {
                                console.log('Detalles guardados');
                                if (valuesSeries.length > 0){
                                    //console.log(valuesSeries);
                                    conteo.insertSeries(valuesSeries, (err, data) => {
                                        if (data) {
                                            console.log('Series guardadas');
                                            res.json({
                                                success: true,
                                                message: '¡Conteo y series registrado con éxito!',
                                            });
                                        } else {
                                            res.json({
                                                success: true,
                                                message: '¡Conteo registrado, ERROR al guardar series!'
                                            });
                                        }
                                    });
                                } else {
                                    console.log("Conteo sin series");
                                    res.json({
                                        success: true,
                                        message: '¡Conteo registrado con éxito!',
                                        id_alm: idAlm,
                                        id_conteo: idConteo,
                                    });
                                }
                            }
                            else {
                                res.json({
                                    success: false,
                                    message: 'Error al registrar los detalles del conteo en la base de datos'
                                })
                            }
                        });
                    }
                    else {
                        res.json({
                            success: false,
                            message: 'Error al registrar el conteo en la base de datos'
                        })
                    }
                });
                /*res.json({
                    success: true,
                    message: "Se han recibido los parámetros",
                    Conteo: conteoData,
                    DetallesConteo: valuesConteos,
                    Series: valuesSeries
                });*/
            }
        });     
    });

    app.get('/getseries/:conteo/:codprod', (req, res) => {
        var idConteo = req.params.conteo;
        var cod_prod = req.params.codprod;
        var idEmpresa = req.decoded.idEmpresa;
        console.log(idEmpresa + " " + idConteo + " " + cod_prod);
        if (idEmpresa && cod_prod && idConteo) {
            conteo.getSeries(idEmpresa, idConteo, cod_prod, (err, data) => {
                if (data) {
                    res.json({series: data});
                } else {
                    
                }
            });
        } else {
            // if there is no token
            // return an error
            return res.status(405).send({
                success: false,
                message: 'Can not get parameters'
            });
        }
    });

    app.get('/getseries/:conteo', (req, res) => {
        var idConteo = req.params.conteo;
        var idEmpresa = req.decoded.idEmpresa;
        console.log(idEmpresa + " " + idConteo);
        if (idEmpresa && idConteo) {
            conteo.getAllSeries(idEmpresa, idConteo, (err, data) => {
                if (data) {
                    res.json({series: data});
                } else {
                    
                }
                
            });
        } else {
            // if there is no token
            // return an error
            return res.status(405).send({
                success: false,
                message: 'Can not get parameters'
            });
        }
    });
}