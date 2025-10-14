# PlayScore

Proyecto semestral para el ramo CC5003 - Aplicaciones Web Reactivas

## Ejecución del proyecto de forma local

Primero se necesita un archivo `.env` en la carpeta backend con las siguientes variables definidas:

```plain
PORT
HOST
MONGODB_URI (solo este es realmente necesario, el resto tienen valores por defecto)
JWT_SECRET
MONGODB_NAME
```

Para ver la página de forma local ejecutar los siguientes comandos:

```sh
cd ./backend
npm run build:all
npm run start
```

Con los pasos anteriores listos abrir en el navegador el siguiente link `http://<HOST>:<PORT>`.

URL aplicación desplegada en el servidor del curso: `https://fullstack.dcc.uchile.cl:7008/`
