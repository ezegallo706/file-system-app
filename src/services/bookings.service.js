const mongoose = require("mongoose");
const BookingsRepository = require("../repositories/bookings.repository");

class BookingsService {
  constructor(repository = new BookingsRepository()) { this.repository = repository; }
  createBooking(data) { return this.repository.create(data); }
  getBookingById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    return this.repository.getById(id);
  }
  async addServiceToBooking(bookingId, serviceId, quantity = 1) {
    if (!mongoose.isValidObjectId(bookingId) || !mongoose.isValidObjectId(serviceId)) return null;
    const booking = await this.repository.findDocumentById(bookingId);
    if (!booking) return null;
    const parsedQuantity = Number(quantity) > 0 ? Number(quantity) : 1;
    const existingService = booking.services.find((item) => item.service.toString() === serviceId);
    if (existingService) existingService.quantity += parsedQuantity;
    else booking.services.push({ service: serviceId, quantity: parsedQuantity });
    return this.repository.save(booking);
  }
}

module.exports = new BookingsService();