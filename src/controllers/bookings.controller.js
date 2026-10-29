const { BookingsService } = require("../services/bookings.service");

const bookingsService = new BookingsService();

async function createBooking(req, res, next) {
  try {
    const booking = await bookingsService.createBooking(req.body);
    return res.status(201).json(booking);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message, details: error.details });
    return next(error);
  }
}

async function getBookingById(req, res, next) {
  try {
    const booking = await bookingsService.getBookingById(req.params.bid);
    return res.status(200).json(booking);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message, details: error.details });
    return next(error);
  }
}

async function addServiceToBooking(req, res, next) {
  try {
    const quantity = req.body?.quantity ?? 1;
    const booking = await bookingsService.addServiceToBooking(req.params.bid, req.params.sid, quantity);
    return res.status(200).json(booking);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message, details: error.details });
    return next(error);
  }
}

module.exports = { createBooking, getBookingById, addServiceToBooking };