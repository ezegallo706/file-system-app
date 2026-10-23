const BookingsDAO = require("../dao/bookings.dao");

class BookingsRepository {
  constructor(dao = new BookingsDAO()) { this.dao = dao; }
  getAll() { return this.dao.getAll(); }
  getById(id) { return this.dao.getById(id); }
  create(data) { return this.dao.create(data); }
  findDocumentById(id) { return this.dao.findDocumentById(id); }
  save(booking) { return this.dao.save(booking); }
}

module.exports = BookingsRepository;