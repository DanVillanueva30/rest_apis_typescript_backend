//Este código va a limpiar la db cada que se ejecute una prueba para evitar tener muchos registros.

import { exit } from "node:process";
import colors from "colors";
import db from "../config/db";

const clearDB = async () => {
    try {
        await db.sync({force: true}) // <-- elimina todos los datos de la DB.
        console.log(colors.magenta('Datos eliminados correctamente'));
        exit(); 
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

// process es un codigo que se ejecuta desde el comand line de node.js 2 es la posición
if(process.argv[2] === '--clear') {
    clearDB();
}