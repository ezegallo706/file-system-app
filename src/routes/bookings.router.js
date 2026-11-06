import { Router } from "express";
import BookingController from "../controllers/bookings.controller.js";
import { validateBody, createBookingSchema, addServiceToBookingSchema } from "../middlewares/validate.js";

const router = Router();
const bookingController = new BookingController();

router.get("/:bid", (req, res) => bookingController.getBookingById(req, res));
router.post("/", validateBody(createBookingSchema), (req, res) => bookingController.createBooking(req, res));
router.post("/:bid/services/:sid", validateBody(addServiceToBookingSchema), (req, res) => bookingController.addServiceToBooking(req, res));

export default router;