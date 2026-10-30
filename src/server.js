import { envConfig } from "./config/env.config.js"
import { Server } from "socket.io";
import { createServer } from "node:http";
import app from "./app.js";

import { connectDB } from "./config/database.config.js";


const httpServer = createServer(app);
export const socketServer = new Server(httpServer);
app.set("socketServer", socketServer);

httpServer.listen(envConfig.port, async () => {
    await connectDB()
    console.log(`Servidor corriendo en http://localhost:${envConfig.port}`);
});

socketServer.on("connection", (socketClient) => {
    console.log("Nuevo cliente conectado");
});
