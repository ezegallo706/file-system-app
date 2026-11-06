import { Router } from "express";
import BookingController from "../controllers/bookings.controller.js";

const router = Router();
const bookingController = new BookingController();

router.get("/:bid", (req, res) => bookingController.getBookingById(req, res));
router.post("/", (req, res) => bookingController.createBooking(req, res));
router.post("/:bid/services/:sid", (req, res) => bookingController.addServiceToBooking(req, res));

export default router;