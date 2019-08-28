let dbAdmin = require('../dbAdmin');
let dateFormat = require('dateformat');
let empresaModel = {};

empresaModel.getEmpresas = (callback) => {
    //console.log(idEmpresa);
    if (dbAdmin) {
        dbAdmin.query("SELECT * FROM empresa", function(err, rows) {
            if (err) {
                throw err;
            }
            else {
                callback(null, rows);
            }
        });
    }
};

empresaModel.getEmpresa = (idEmpresa, callback) => {
    //console.log(idEmpresa);
    if (dbAdmin) {
        dbAdmin.query("SELECT * FROM empresa WHERE id_empresa = " + idEmpresa, function(err, rows) {
            if (err) {
                throw err;
            }
            else {
                callback(null, rows);
            }
        });
    }
};

empresaModel.getUsers = (idempresa, callback) => {
    if (dbAdmin) {
        dbAdmin.query("SELECT * FROM usuario WHERE id_empresa = "+ idempresa, (err, rows) => {
            if (err) {
                throw err;
            }
            else {
                callback(null, rows);
            }
        });
    }
};

empresaModel.insertEmpresa = (empresa, callback) => {
    if (dbAdmin) {
        dbAdmin.query("INSERT INTO empresa SET ? ", [empresa], (err, rows) => {
            if (err) {
                throw err;
            }
            else {
                callback(null, rows);
            }
        });
    }
};
module.exports = empresaModel;
