import { Router } from "express";
import { ServicesService } from "../services/services.service.js";
import { socketServer } from "../server.js";

const router = Router();

router.get("/index", async (req, res, next) => {

    socketServer.emit("nueva-visita")
    res.status(200).render("index");
})

router.get("/services", async (req, res, next) => {

    const services = await new ServicesService().getServices();

    res.status(200).render("services", { services });
});

export default router;