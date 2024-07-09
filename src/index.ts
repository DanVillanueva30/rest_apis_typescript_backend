import colors from "colors";
import server from "./server";

const port = process.env.PORT || 4000;

//mandar llamar sever de express
server.listen(port, () => { // <-- Se asigna el puerto 4000.
    console.log(colors.cyan.bold(`REST API desde el server ${port}`) );
})