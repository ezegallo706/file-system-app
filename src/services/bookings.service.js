const BookingsRepository = require("../repositories/bookings.repository");
const { ServicesService } = require("./services.service");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

class BookingsService {
  constructor(repository = new BookingsRepository(), servicesService = new ServicesService()) {
    this.repository = repository;
    this.servicesService = servicesService;
  }

  async createBooking(payload) {
    const { clientName, clientEmail, date, time, status = "pending", services = [] } = payload || {};

    if (!clientName || !clientEmail || !date || !time) {
      throw createError("Faltan campos obligatorios", 400);
    }
    if (typeof clientEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      throw createError("clientEmail debe tener formato válido", 400);
    }
    if (Number.isNaN(Date.parse(date))) throw createError("date debe ser una fecha válida", 400);
    if (typeof time !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      throw createError("time debe tener formato HH:mm válido", 400);
    }
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      throw createError("status debe ser pending, confirmed o cancelled", 400);
    }
    if (!Array.isArray(services)) throw createError("services debe ser una lista", 400);

    return this.repository.create({ clientName, clientEmail, date, time, status, services });
  }

  async getBookingById(id) {
    const booking = await this.repository.getById(id);
    if (!booking) throw createError("Reserva no encontrada", 404);
    return booking;
  }

  async addServiceToBooking(bookingId, serviceId, quantity = 1) {
    await this.getBookingById(bookingId);
    await this.servicesService.getServiceById(serviceId);
    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      throw createError("quantity debe ser un entero positivo", 400);
    }
    return this.repository.addService(bookingId, serviceId, parsedQuantity);
  }
}

module.exports = { BookingsService };