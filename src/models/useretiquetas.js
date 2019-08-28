var dbAdmin = require('../dbAdmin2');

let userModel = {};

userModel.getUser = (callback) => {
    if (dbAdmin) {
        dbAdmin.query("SELECT * FROM usuarios ", (err, rows) => {
            if (err) {
                throw err;
            }
            else {
                callback(null, rows);
            }
        });
    }
};

userModel.getValidarUsuario = (usuario, callback) => {
    console.log(usuario);
    //console.log(contra);
    if (dbAdmin) {
        dbAdmin.query(`SELECT 
            b.nombre_empresa AS 'empresa',
            b.dominio AS 'dominio',
            a.username AS 'usuario', 
            a.password AS 'contra',
            a.almacen AS 'almacen',
            a.imprimir AS 'imprimir'
        FROM 
            usuarios AS a
            INNER JOIN
            empresa AS b ON a.id_empresa=b.id_empresa   
        WHERE username='`+usuario+`' `, (err, rows) => {
            if (err) {
                throw err;
            }
            else {
                callback(null, rows);
            }
        });
    }


};



module.exports = userModel;