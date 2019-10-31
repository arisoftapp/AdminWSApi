var dbAdmin = require('../dbAdmin');

let userModel = {};

userModel.getValidarUsuario = (usuario, callback) => {
    //console.log(usuario);
    //console.log(contra);
    if (dbAdmin) {
        dbAdmin.query(`SELECT 
            b.nombre_empresa AS 'empresa',
            b.id_empresa AS 'id_empresa',
            b.dominio AS 'dominio',
            a.username AS 'usuario'
        FROM 
            usuario AS a
            INNER JOIN
            empresa AS b ON a.id_empresa=b.id_empresa   
        WHERE username='`+usuario+`' 
        `, (err, rows) => {
            if (err) {
                throw err;
                callback(rows,null);
            }
            else {
                callback(null, rows);
            }
        });
    }


};



module.exports = userModel;