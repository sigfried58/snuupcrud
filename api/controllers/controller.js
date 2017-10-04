let async = require('async');
let _ = require('lodash');

/* Obtener usuarios */
exports.list = function(req, res){
    async.waterfall([
    function (cb) {
        req.getConnection(cb);
    },
    function (connection, cb) {
        connection.query('Select * from mock_data', cb);
    }], (err, rows, field) => {
        if (err) {
          return res
            .status(500)
            .send({
              message: 'Ocurrio un error al desplegar los usuarios'
            });
        }
        return res.status(200).send({users: rows});
      });   
};

/* Crear Usuario */
exports.save = function(req,res){
    
    let input = JSON.parse(JSON.stringify(req.body));
    let index = 0;
        
    async.waterfall([
    function (cb) {
        if (_.isUndefined(input.id) || _.isUndefined(input.first_name) || _.isUndefined(input.last_name) || _.isUndefined(input.email)
            || _.isUndefined(input.password) || _.isUndefined(input.Username)) {
            return res
            .status(403)
            .send({
                message: 'Parametros no enviados, favor revisar'
            });
        }
        req.getConnection(cb);
    },
    function (connection, cb) {
        connection.query('Select count(*) as count ' + 
        ' FROM mock_data where id = ?',[parseInt(input.id)], cb);
    },
    function (rows, field, cb) {
        if (rows[index].count) {
            return res
            .status(403)
            .send({
                message: 'El ID ya existe en el sistema'
            });
        }
        req.getConnection(cb);
    },
    function (connection, cb) {
        connection.query('Select count(*) as count ' + 
        ' FROM mock_data where Username = ?',[input.Username.toLowerCase()], cb);
    },
    function (rows, field, cb) {
        if (rows[index].count) {
            return res
            .status(403)
            .send({
                message: 'El username ya existe en el sistema'
            });
        }
        req.getConnection(cb);
    }, 
    function (connection, cb) {
        let data = {   
            id    : input.id,
            first_name : input.first_name,
            last_name   : input.last_name,
            email   : input.email.toLowerCase(),
            password: input.password,
            Username: input.Username.toLowerCase()
        };
        connection.query("Insert into mock_data set ? ",data, cb);
    }], (err, result) => {
        if (err) {
          return res
            .status(500)
            .send({
              message: 'Ocurrio un error al ingresar usuario'
            });
        }

        if (!result.affectedRows) {
            return res
            .status(500)
            .send({
              message: 'Ocurrio un error al ingresar usuario'
            });
        }

        return res.status(200).send({
          message: 'Usuario agregado exitosamente'
        });
    });
};

/* Editar Usuario */
exports.edit = function(req,res){
    
    let input = JSON.parse(JSON.stringify(req.body));
    let id = req.params.id;
    let index = 0;

    async.waterfall([
    function (cb) {
        if (_.isUndefined(id) || _.isUndefined(input.first_name) || _.isUndefined(input.last_name) || _.isUndefined(input.email)
            || _.isUndefined(input.password) || _.isUndefined(input.Username)) {
            return res
            .status(403)
            .send({
                message: 'Parametros no enviados, favor revisar'
            });
        }
        req.getConnection(cb);
    },
    function (connection, cb) {
        connection.query('Select count(*) as count ' + 
        ' FROM mock_data where id = ?',[id], cb);
    },
    function (rows, field, cb) {
        if (!rows[index].count) {
            return res
            .status(403)
            .send({
                message: 'El usuario no se encuentra en el sistema'
            });
        }
        req.getConnection(cb);
    },
    function (connection, cb) {
        connection.query('Select count(*) as count ' + 
        ' FROM mock_data where Username = ? and id != ? COLLATE utf8_bin',[input.Username.toLowerCase(), id], cb);
    },
    function (rows, field, cb) {
        if (rows[index].count) {
            return res
            .status(403)
            .send({
                message: 'El username se encuentra ocupado en el sistema'
            });
        }
        req.getConnection(cb);
    },
    function (connection, cb) {
        let data = {
            first_name : input.first_name,
            last_name   : input.last_name,
            email   : input.email.toLowerCase(),
            password: input.password,
            Username: input.Username.toLowerCase()
        };
        connection.query("Update mock_data set ? where id = ? ",[data, id], cb)
    }], (err, result) => {
        if (err) {
          return res
            .status(500)
            .send({
              message: 'Ocurrio un error al editar usuario'
            });
        }

        if (!result.affectedRows) {
            return res
            .status(500)
            .send({
              message: 'Ocurrio un error al editar usuario'
            });
        }

        return res.status(200).send({
          message: 'Usuario editado exitosamente'
        });
    });
};

/* Eliminar Usuario */
exports.delete = function(req,res){
    let id = req.params.id;
    let index = 0;

    async.waterfall([
    function (cb) {
        if (_.isUndefined(id)) {
            return res
            .status(403)
            .send({
                message: 'Parametro no enviado, favor revisar'
            });
        }
        req.getConnection(cb);
    },
    function (connection, cb) {
        connection.query('Select count(*) as count ' + 
        ' FROM mock_data where id = ? COLLATE utf8_bin',[id], cb);
    },
    function (rows, field, cb) {
        if (!rows[index].count) {
            return res
            .status(403)
            .send({
                message: 'El usuario no se encuentra en el sistema'
            });
        }
        req.getConnection(cb);
    },
    function (connection, cb) {
        connection.query("Delete from mock_data where id = ?",[id], cb);
    }], (err, result) => {
        if (err) {
          return res
            .status(500)
            .send({
              message: 'Ocurrio un error al eliminar usuario'
            });
        }

        if (!result.affectedRows) {
            return res
            .status(500)
            .send({
              message: 'Ocurrio un error al eliminar usuario'
            });
        }

        return res.status(200).send({
          message: 'Usuario eliminado exitosamente'
        });
    });
};

        
/* Autentificación Login */
exports.login = function(req, res) {
  let auth = JSON.parse(JSON.stringify(req.body));
  let index = 0;

  async.waterfall([
    function (cb) {
        if (_.isUndefined(auth.username) || _.isUndefined(auth.password)) {
            return res
            .status(403)
            .send({
                message: 'Parametros no enviados, favor revisar'
            });
        }
        req.getConnection(cb);
    },
    function (connection, cb) {
        connection.query('Select count(*) as count ' + 
        ' FROM mock_data where Username = ?',[auth.username.toLowerCase()], cb);
    },
    function (rows, field, cb) {
        if (!rows[index].count) {
            return res
            .status(403)
            .send({
                message: 'El usuario no se encuentra en el sistema'
            });
        }
        req.getConnection(cb);
    },
    function (connection, cb) {
        connection.query('Select first_name, last_name, email ' + 
        ' FROM mock_data where Username = ? and password = ? COLLATE utf8_bin',[auth.username.toLowerCase(), auth.password], cb);
    }], (err, result) => {
        if (err) {
          return res
            .status(500)
            .send({
              success: false
            });
        }
        if (!result.length) return res.status(500).send({
          success: false
        });

        return res.status(200).send({
          success: true
        });
    });
};