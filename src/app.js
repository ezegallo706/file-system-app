import express from "express";
import { engine } from "express-handlebars";
import serviceRouter from "./routes/services.router.js";
import bookingRouter from "./routes/bookings.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use("/", viewsRouter);

app.use("/api/services", serviceRouter);
app.use("/api/bookings", bookingRouter);

app.use((req, res, next) => {
    res.status(404).send("la pagina solicitada no existe");
});

export default app;
