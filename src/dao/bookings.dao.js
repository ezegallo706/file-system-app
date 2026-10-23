const Booking = require("../models/booking.model");

class BookingsDAO {
  getAll() { return Booking.find().lean(); }
  getById(id) { return Booking.findById(id).lean(); }
  create(data) { return Booking.create(data); }
  findDocumentById(id) { return Booking.findById(id); }
  save(booking) { return booking.save(); }
}

module.exports = BookingsDAO;