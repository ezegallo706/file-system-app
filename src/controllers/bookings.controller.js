const { bookingService } = require("../container");
const asyncHandler = require("./asyncHandler");

module.exports = {
  createBooking: asyncHandler(async (req, res) => {
    const { id, ...bookingData } = req.body || {};
    const booking = await bookingService.createBooking(bookingData);
    return res.status(201).json(booking);
  }),

  getBookingById: asyncHandler(async (req, res) => {
    const booking = await bookingService.getBookingById(req.params.bid);
    return res.status(200).json(booking);
  }),

  addServiceToBooking: asyncHandler(async (req, res) => {
    const { bid, sid } = req.params;
    const quantity = Number(req.body?.quantity ?? 1);
    const updatedBooking = await bookingService.addServiceToBooking(bid, sid, quantity);
    return res.status(200).json(updatedBooking);
  }),
};