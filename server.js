var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  bodyParser = require('body-parser'),
  mysql = require('mysql'),
  connection  = require('express-myconnection'),
  morgan = require('morgan'); 
  
app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'root',
        password : 'jimmy',
        port : 3306, //port mysql
        database:'users'
    },'request')
);

app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/routes'); //importing route
routes(app); 

app.listen(port);