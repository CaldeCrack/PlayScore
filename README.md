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

# si se está usando Windows usar alguno de los siguientes comandos
# para usar bash de Git y que los comandos para correr el servidor
npm config set script-shell "C:\\Program Files (x86)\\Git\\bin\\bash.exe"
npm config set script-shell "C:\\Program Files\\Git\\bin\\bash.exe"

npm run build:all
npm run start
```

Con los pasos anteriores listos abrir en el navegador el siguiente link `http://<HOST>:<PORT>`.
