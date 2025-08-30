TECNOLOGÍAS USADAS:
Asp.net core (C#), EntityFramework, Windows Server, React, Bootstrap
Dependencias React:
-react
-react-bootstrap
-react-dom
-react-router-bootstrap
-react-router-dom

Paquetes .Net:
-EntityFrameworkCore
-EntityFrameworkCore
-EntityFrameworkCoreTools
-Serilog.AspNetCore
-Serilog.Sinks.File


ENDPOINTS:

CUSTOMERS
// GET: api/Customer
Request:
api/Customer
Response:
[
    {
        "id": 5,
        "name": "Marisol Martínez Rodríguez",
        "email": "marisol@hotmail.com"
    },
    {
        "id": 6,
        "name": "Roberto Vázquez López",
        "email": "roberto@hotmail.com"
    },
    {
        "id": 7,
        "name": "Victoria Morales Gutiérrez",
        "email": "victoria@hotmail.com"
    },
    {
        "id": 9,
        "name": "Juan Gómez Ortíz",
        "email": "juan@hotmail.com"
    },
    {
        "id": 10,
        "name": "Laura Aguilar Millán",
        "email": "laura@hotmail.com"
    }
]

// GET: api/Customer/id
Request: 
api/Customer/10
Response:
{
  "id": 10,
  "name": "Laura Aguilar Millán",
  "email": "laura@hotmail.com"
}


// POST: api/Customer
Request: 
api/Customer
{
    "name": "Marisol Martínez Rodríguez",
    "email": "marisol@hotmail.com"
}
Response:
{
    "id": 5,
    "name": "Marisol Martínez Rodríguez",
    "email": "marisol@hotmail.com"
}


// PUT: api/Customer/id
Request:
api/Customer/6
{
     "name": "Roberto Vázquez López",
     "email": "roberto@hotmail.com"
}
Response:
{
     "id": 6,
     "name": "Roberto Vázquez López",
     "email": "roberto@hotmail.com"
}


// DELETE: api/Customer/id
Request: 
api/Customer/20
Response
Codigo 204, accion realizada.



APPOINTMENTS
 // GET: api/Appointment
 Request:
 api/Appointment?ini=2025-08-01&fin=2025-08-29&Status=1 //Permite obtener las citas, los filtros son opcionales
Response:
[
    {
        "id": 11,
        "dateTime": "2025-08-12T16:35:00",
        "status": 0,
        "customerId": 5,
        "customer": {
            "id": 5,
            "name": "Marisol Martínez Rodríguez",
            "email": "marisol@hotmail.com"
        }
    },
    {
        "id": 12,
        "dateTime": "2025-08-03T23:10:00",
        "status": 0,
        "customerId": 5,
        "customer": {
            "id": 5,
            "name": "Marisol Martínez Rodríguez",
            "email": "marisol@hotmail.com"
        }
    },
    {
        "id": 13,
        "dateTime": "2025-08-06T09:30:00",
        "status": 0,
        "customerId": 9,
        "customer": {
            "id": 9,
            "name": "Juan Gómez Ortíz",
            "email": "juan@hotmail.com"
        }
    }
]


 // GET: api/Appointment/id
 Request:
 api/Appointment/5 //Obtiene informacion de la cita filtrada por ID
Response:
{
  "id": 10,
  "dateTime": "2025-08-09T17:50:00",
  "status": 1,
  "customerId": 7,
  "customer": null
}


//POST api/Appointment //Para insertar nueva cita
Request:
{
    "dateTime": "2025-09-01T12:10",
    "status": 0,
    "customerId": 9
}
Response:
{
    "id": 10,
    "dateTime": "2025-09-01T12:10:00",
    "status": 0,
    "customerId": 9,
}


// PUT: api/Appointment/id
Request:
api/Appointment/1     //el id de la cita a actualizar + Json con los datos 
{
    "dateTime": "2025-08-03T19:50:00",
    "status": 2,
    "customerId": 5,
}
Response:
{
    "id": 1,
    "dateTime": "2025-08-03T19:50:00",
    "status": 2,
    "customerId": 5,
}

// DELETE api/Appointment/id
Request:
api/Appointment/11
Response:
Codigo 204, accion realizada.

-----------------------------------
GENERAR VERSIÓN PRODUCCIÓN DE PROYECTO REACT
Dentro de la carpeta del proyecto con npm install se generan los archivos para producción
Los archivos que se deben cargar a IIS son los de la carpeta dist
-------------------------------


CONEXIÓN A LA BD

Crear un nuevo usuario dentro del managment de SQL SERVER ->Security ->Logins,
en mi caso el usuario es web_user con Atenticacion de SQL SERVER, yo usé contraseña "ET64_fd.542#742", quitar el check de Enforce password policy, guardar cambios. 

En la sección de permisos (User Mapping) seleccionar la bd y el permiso de db_owner para poder leer y escribir en ella; guardar cambios

En propiedades del servidor -> Security seleccionar autenticacion de servidor SQL Server and Windows Athentication mode para que permita ambas formas de autenticación
--------------------------------------

HABILITAR IIS

Panel de control Programas-> Activar o desactivar programas 

En la carpeta "Servicios World Wide Web":
Expande la subcarpeta Características de desarrollo de aplicaciones.
Dentro de esta, marca las casillas para Extensibilidad de .NET, ASP.NET, Extensiones ISAPI, y Filtros ISAPI.

En la carpeta "Herramientas de administración web":
Expande esta subcarpeta.
Marca la casilla para Consola de administración de IIS.

-------------------------------------------------------

Publicar Proyecto

Dentro del proyecto clic derecho y en Publicar
Cick en Nuevo Perfil por Carpeta, da una ruta por defecto, dar en finalizar y cerrar.
Ahora click en el botón de Publicar

Abrir la ruta donde estan los archivos generados de publicacion
Checar que version de .net se tiene, en este caso .net 8.0
En el navegador buscar hosting bundle .net 8.0 y en la pagina oficial de microsoft descargar Hosting bundle para Asp.net Core Runtime
e instalarlo en caso de que no lo tengas. Dentro de IIS-> módulos debe de estar AspNetCoreModule2 para que nos permita trabajar con asp.net

Creamos una carpeta en la ruta de IIS inetpub/wwwroot/ en mi caso Prueba-Tecnica-Dorantes, copiar dentro los archivos generados de la publicación
Creamos una carpeta para el front y otra para el back
Dentro de IIS creamos un sitio web, en mi caso el nombre SitioPrueba y apunta al front C:\inetpub\wwwroot\Prueba-Tecnica-Dorantes\frontend

Ahora en IIS refrescar y crear un grupo de aplicaciones, en mi caso PruebaTecnica-API, en versión poner Sin Código administrado, dar clic en Aceptar
a la carpeta de backend dar clic derecho y convertir en aplicacion, seleccionar el Pool que acabamos de crear y Aceptar
Si el puerto 80 está ocupado, seleccionar 8080.

Checar en web.config que apunte correctamente al archivo ddl del proyecto publicado

Se creó una carpeta de logs y se le asignó permisos de escritura para poner los logs generados por Serilog.

La ruta donde corre el proyecto es en localhost en el puerto 8080 http://localhost:8080/

