import express from "express";
import swaggerUi from "swagger-ui-express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";

import swaggerSpec, {swaggerUiOptions} from "./config/swagger";
import router from "./router";
import db from "./config/db";

//Conectar a base de datos
async function connectDB() {
    await db.authenticate();
    db.sync();
    // console.log(colors.magenta('Conexión exitosa') );
    // console.log(colors.red('Error al conectar con la db') );
}
connectDB();

//Instancia de express.
const server = express();

//Permitir conexiones
const corsOptions : CorsOptions = {
    origin: function(origin, callback) { // <-- callback permite/niega la conexión.
        if(origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
        }
    }
}
server.use(cors(corsOptions));
//Leer datos de formularios.
server.use(express.json());

//Morgan sirve para ver m'as o menos detalles de las peticiones que se están loggeando.
server.use(morgan('dev'));

// .use engloba todos los verbos y se ejecuta en cada uno de ellos, dentro del router va a filtrar el verbo.
server.use('/api/products', router);

server.get('/api', (req, res) => {
    res.json({msg: 'Desde API'});
});

//Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

export default server;