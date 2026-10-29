const path = require("path");
const JsonFileDAO = require("./jsonFile.dao");

class BookingsDAO {
  constructor(fileStore = new JsonFileDAO(path.join(__dirname, "../data/bookings.json"))) {
    this.fileStore = fileStore;
  }

  async getById(id) {
    const bookings = await this.fileStore.readAll();
    return bookings.find((booking) => Number(booking.id) === Number(id)) || null;
  }

  async create(data) {
    const bookings = await this.fileStore.readAll();
    const ids = bookings.map((booking) => Number(booking.id)).filter(Number.isFinite);
    const booking = {
      id: ids.length ? Math.max(...ids) + 1 : 1,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      date: data.date,
      time: data.time,
      status: data.status || "pending",
      services: Array.isArray(data.services) ? data.services : [],
    };
    bookings.push(booking);
    await this.fileStore.writeAll(bookings);
    return booking;
  }

  async addService(bookingId, serviceId, quantity) {
    const bookings = await this.fileStore.readAll();
    const booking = bookings.find((item) => Number(item.id) === Number(bookingId));
    if (!booking) return null;

    const existing = booking.services.find((item) => Number(item.service) === Number(serviceId));
    if (existing) {
      existing.quantity += quantity;
    } else {
      booking.services.push({ service: Number(serviceId), quantity });
    }

    await this.fileStore.writeAll(bookings);
    return booking;
  }
}

module.exports = BookingsDAO;