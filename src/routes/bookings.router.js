const express = require("express");
const bookingsController = require("../controllers/bookings.controller");

const router = express.Router();
router.post("/", bookingsController.createBooking);
router.get("/:bid", bookingsController.getBookingById);
router.post("/:bid/services/:sid", bookingsController.addServiceToBooking);

module.exports = router;
