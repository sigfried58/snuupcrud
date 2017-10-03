# Snuupcrud

CRUD realizado con Node v6.6, Express v4 y MySql (BD)

## Instalación
Ejecutar el siguiente comando en consola, previa instalación de [NodeJs](https://nodejs.org/es/)
```
npm install
```

Dentro del archivo server.js configurar parametros de conexión a la BD
```
app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'root',
        password : 'jimmy',
        port : 3306, //port mysql
        database:'users'
    },'request')
);

```
Crear tabla "MOCK_DATA" BD MySql
```
create table MOCK_DATA (
	id INT,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	email VARCHAR(50),
	password VARCHAR(50),
	Username VARCHAR(50)
);
```
Insertar registro a modo de ejemplo
```
insert into MOCK_DATA (id, first_name, last_name, email, password, Username) values (1, 'Patton', 'Tapscott', 'ptapscott0@spiegel.de', 'vFStrrnk4s', 'ptapscott0');
```
