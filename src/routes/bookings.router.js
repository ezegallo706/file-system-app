import { Router } from "express";
import {
	getBookings,
	getBookingById,
	createBooking,
	addServiceToBooking
} from "../controllers/bookings.controller.js";
import {
	validateBody,
	validateBookingsQuery,
	validateObjectIdParams,
	createBookingSchema,
	addServiceToBookingSchema
} from "../middlewares/validate.js";

const router = Router();

router.get("/", validateBookingsQuery, getBookings);
router.get("/:bid", validateObjectIdParams("bid"), getBookingById);
router.post("/", validateBody(createBookingSchema), createBooking);
router.post(
	"/:bid/services/:sid",
	validateObjectIdParams("bid", "sid"),
	validateBody(addServiceToBookingSchema),
	addServiceToBooking
);

export default router;