let  async = require('async');

/* Obtener usuarios */
exports.list = function(req, res){
  req.getConnection(function(err,connection){
     connection.query('SELECT * FROM mock_data', function(err,rows) {
        if (err) {
           return res.send(err);
        }
        return res.send(rows);
      });   
    });
};

/* Autentificación Login */
exports.login = function(req, res) {
  let auth = JSON.parse(JSON.stringify(req.body));

  async.waterfall([
    function (cb) {
        req.getConnection(cb);
    },
    function (connection, cb) {
        connection.query('SELECT first_name ' + 
        ' FROM mock_data where Username = ?',[auth.user], cb);
    },
    function (rows, field, cb) {
        if (!rows.length) {
            return res.status(404).send('Usuario no encontrado');
        }
        req.getConnection(cb);
    },
    function (connection, cb) {
        connection.query('SELECT first_name, last_name, email ' + 
        ' FROM mock_data where Username = ? and password = ?',[auth.user, auth.pass], cb);
    }], (err, rows, field) => {
        if (err){ 
            return res.send(err);
        }

        if (!rows.length) {
            return res.status(404).send('Paswword incorrecto');
        } 
        return res.send(rows);
    });
};

/* Crear Usuario */
exports.save = function(req,res){
    
    let input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        let data = {   
            id    : input.id,
            first_name : input.first_name,
            last_name   : input.last_name,
            email   : input.email,
            password: input.password,
            Username: input.Username
        };
        
        let query = connection.query("INSERT INTO mock_data set ? ",data, function(err, rows)
        {
  
          if (err){
              res.send(err);
            }
            res.send('Usuario creado correctamente');       
        });
            
    });
};

/* Editar Usuario */
exports.edit = function(req,res){
    
    let input = JSON.parse(JSON.stringify(req.body));
    let id = req.params.id;
    
    req.getConnection(function (err, connection) {
        
        let data = {
            first_name : input.first_name,
            last_name   : input.last_name,
            email   : input.email,
            password: input.password,
            Username: input.Username
        };

        connection.query("UPDATE mock_data set ? WHERE id = ? ",[data,id], function(err, rows)
        {
  
         if(err) {
            res.send(err);
            }
            res.send('Usuario editado correctamente');       
          
        });
    
    });
};

/* Eliminar Usuario */
exports.delete = function(req,res){
    let id = req.params.id;
    
    req.getConnection(function (err, connection) {
        connection.query("DELETE FROM mock_data  WHERE id = ? ",[id], function(err, rows)
        {   
             if(err) {
                return res.send(err);
             }
            return res.send('Usuario eliminado correctamente');          
        });
        
     });    
};
