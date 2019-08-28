let dbAdmin = require('../dbAdmin');
let dateFormat = require('dateformat');
let conteoModel = {};

conteoModel.getConteos = (idEmpresa, callback) => {
    //console.log(idEmpresa);
    if (dbAdmin) {
        dbAdmin.query(`SELECT a.*, 
                            b.username, 
                            c.nombre_status AS estado 
                        FROM conteo_inv AS a
                        INNER JOIN
                            usuario AS b ON a.id_usuario = b.id_user AND a.id_empresa = b.id_empresa
                        INNER JOIN 
                            estatus_conteo AS c ON a.id_status = c.id_status 
                        WHERE a.id_empresa = ?  ORDER BY ult_act DESC`, [idEmpresa], function(err, rows) {
            if (err) {
                throw err;
            }
            else {
                callback(null, rows);
            }
        });
    }
};

conteoModel.getConteo = (idEmpresa, idConteo, callback) => {
    //console.log(idEmpresa);
    if (dbAdmin) {
        dbAdmin.query(`SELECT a.*, 
                            b.username, 
                            c.nombre_status AS estado 
                        FROM conteo_inv AS a
                        INNER JOIN
                            usuario AS b ON a.id_usuario = b.id_user AND a.id_empresa = b.id_empresa
                        INNER JOIN
                            estatus_conteo AS c ON a.id_status = c.id_status 
                        WHERE a.id_empresa = ` + idEmpresa + ` AND a.id_conteo = ` + idConteo, function(err, rows) {
            if (err) {
                throw err;
            }
            else {
                callback (null, rows);
            }
        });
    }
};

conteoModel.getConteoDet = (idEmpresa, idConteo, callback) => {
    //console.log(idEmpresa);
    if (dbAdmin) {
        dbAdmin.query(`SELECT * FROM detalle_conteo_inv 
                        WHERE id_empresa = ` + idEmpresa + ` AND id_conteo = ` + idConteo, function(err, rows) {
            if (err) {
                throw err;
            }
            else {
                callback (null, rows);
            }
        });
    }
};



conteoModel.insertConteo = (conteoData, callback) => {
    if (dbAdmin) {
        dbAdmin.query('INSERT INTO conteo_inv SET ?', conteoData,
            (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    callback(null, result);
                }
            }
        )
    }
};

conteoModel.getUltimoConteo = (idEmpresa, callback) => {
    //console.log(idEmpresa);
    if (dbAdmin) {
        dbAdmin.query(`SELECT MAX(id_conteo) AS ultimo FROM conteo_inv WHERE id_empresa = ` + idEmpresa + 
        ` ORDER BY id_conteo ASC`, function(err, rows) {
            if (err) {
                throw err;
            }
            else {
                callback (null, rows);
            }
        });
    }
};

conteoModel.insertDetConteo = (conteoData, callback) => {
    if (dbAdmin) {
        dbAdmin.query(`INSERT INTO detalle_conteo_inv (id_empresa, id_conteo, cod_prod, descripcion, existencia, 
            conteo, diferencia, es_series, comentario) VALUES ` + conteoData,
            (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    callback(null, result);
                }
            }
        )
    }
};

conteoModel.insertSeries = (seriesData, callback) => {
    if (dbAdmin) {
        dbAdmin.query(`INSERT INTO articulo_conteo_serie (id_empresa, id_conteo, 
            cod_prod, serie, estatus) VALUES ` + seriesData,
            (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    callback(null, result);
                }
            }
        )
    }
};

conteoModel.getSeries = (idEmpresa, idConteo, cod_prod, callback) => {
    if (dbAdmin) {
        dbAdmin.query(`SELECT a.id_conteo, b.nombre_alm, a.cod_prod, a.serie, c.nombre_estatus AS estatus FROM articulo_conteo_serie AS a 
        INNER JOIN conteo_inv AS b ON a.id_conteo = b.id_conteo AND a.id_empresa = b.id_empresa
        INNER JOIN estatus_serie AS c ON a.estatus = c.id_estatus_conteo
        WHERE a.id_empresa = ` + idEmpresa + ` AND a.id_conteo = ` + idConteo +` AND a.cod_prod = '` + cod_prod + `';`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    callback(null, result);
                }
            }
        )
    }
}

conteoModel.getAllSeries = (idEmpresa, idConteo, callback) => {
    if (dbAdmin) {
        dbAdmin.query(`SELECT a.id_empresa, a.id_conteo, a.cod_prod, a.serie, b.nombre_estatus AS estatus FROM articulo_conteo_serie AS a
        INNER JOIN estatus_serie AS b ON a.estatus = b.id_estatus_conteo
        WHERE id_empresa = ` + idEmpresa + ` AND id_conteo = ` + idConteo +`;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    callback(null, result);
                }
            }
        )
    }
}

conteoModel.putConteoStatus = (idEmpresa, idConteo, status, callback) => {
    if (dbAdmin) {
        dbAdmin.query(`UPDATE conteo_inv SET id_status = ` + status + ` WHERE id_empresa =  ` + idEmpresa + ` AND id_conteo = ` + idConteo +`;`,
            (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    callback(null, result);
                }
            }
        )
    }
}

module.exports = conteoModel;