import { envConfig } from "./config/env.config.js"
import { Server } from "socket.io";
import { createServer } from "node:http";
import app from "./app.js";

import { connectDB } from "./config/database.config.js";


const httpServer = createServer(app);
export const socketServer = new Server(httpServer);
app.set("socketServer", socketServer);

socketServer.on("connection", (socketClient) => {
    console.log("Nuevo cliente conectado");
});

const startServer = async () => {
    try {
        await connectDB();
        httpServer.listen(envConfig.port, () => {
            console.log(`Servidor corriendo en http://localhost:${envConfig.port}`);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error.message);
        process.exitCode = 1;
    }
};

startServer();
