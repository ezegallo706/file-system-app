const BookingsDAO = require("../dao/bookings.dao");

class BookingsRepository {
  constructor(dao = new BookingsDAO()) {
    this.dao = dao;
  }

  getById(id) { return this.dao.getById(id); }
  create(data) { return this.dao.create(data); }
  addService(bookingId, serviceId, quantity) {
    return this.dao.addService(bookingId, serviceId, quantity);
  }
}

module.exports = BookingsRepository;