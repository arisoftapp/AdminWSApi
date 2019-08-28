var dbAdmin = require('../dbAdmin');

let userModel = {};

//Read
userModel.getUser = (callback) => {
    if (dbAdmin) {
        dbAdmin.query("SELECT * FROM usuario ", (err, rows) => {
            if (err) {
                throw err;
            }
            else {
                callback(null, rows);
            }
        });
    }
};



userModel.getUserByUsername = (username, callback) => {
    if (dbAdmin) {
        dbAdmin.query(`SELECT a.*, 
        b.nombre_empresa AS empresa,
        b.dominio FROM usuario AS a INNER JOIN empresa AS b ON a.id_empresa = b.id_empresa WHERE a.username = ?`, [username], function(err, row) {
            if (err) {
                throw err;
            }
            else {
                callback(null, row);
            }
        });
    }
};

userModel.getUserByAdminUsername = (username, callback) => {
    if (dbAdmin) {
        dbAdmin.query(`SELECT *  FROM admin_user WHERE admin_username = ?`, [username], function(err, row) {
            if (err) {
                throw err;
            }
            else {
                callback(null, row);
            }
        });
    }
};

userModel.getUserById = (id, empresa, callback) => {
    if (dbAdmin) {
        dbAdmin.query(`SELECT username FROM usuario WHERE id_empresa = `+ empresa +` AND id_user = `+ id , function(err, row) {
            if (err) {
                throw err;
            }
            else {
                callback(null, row);
            }
        });
    }
};

userModel.getDeviceID = (username, callback) => {
    if (dbAdmin){
        query = 
        dbAdmin.query(`SELECT a.id, a.deviceid FROM dispositivos_usuario as a
                  INNER JOIN usuario as b on a.idusuario = b.id
                  WHERE b.username = ?`, username, (err, row)=> {
            if (!err) {
                callback(null, row);
            }
            else {
                throw err;
            }
        });
    }
};

//Insert
userModel.insertUser = (userData, callback) => {

    if (dbAdmin) {
        dbAdmin.query('INSERT INTO usuario SET ?', userData,
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

//CHECK PASSWORD    
userModel.getPass = (ID, empresa, callback) => {
    if (dbAdmin) {
        dbAdmin.query(`SELECT password FROM usuario WHERE id_empresa = `+ empresa +` AND id_user = `+ ID, function(err, row) {
            if (err) {
                throw err;
            }
            else {
                callback(null, row);
            }
        })
    }
};

module.exports = userModel;