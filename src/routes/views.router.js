import { Router } from "express";
import { ServicesService } from "../services/services.service.js";

const router = Router();

router.get("/index", async (req, res, next) => {

    req.app.get("socketServer")?.emit("nueva-visita")
    res.status(200).render("index");
})

router.get("/services", async (req, res, next) => {

    const { services } = await new ServicesService().getServices();

    res.status(200).render("services", { services });
});

router.get("/bookings", async (req, res, next) => {
    try {
        const { services } = await new ServicesService().getServices();
        res.status(200).render("bookings", {
            services: services.filter((service) => service.available)
        });
    } catch (error) {
        next(error);
    }
});

export default router;