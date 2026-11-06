const path = require("path");
const BookingManager = require("../managers/BookingManager");
const ServiceManager = require("../managers/ServiceManager");
const ServiceError = require("./ServiceError");

const bookingManager = new BookingManager(path.join(__dirname, "../data/bookings.json"));
const serviceManager = new ServiceManager(path.join(__dirname, "../data/services.json"));

function validateBookingPayload(payload) {
  const requiredFields = ["clientName", "clientEmail", "date", "time", "status"];
  const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === "");

  if (missing.length > 0) {
    return [`Los campos obligatorios faltan: ${missing.join(", ")}`];
  }
  if (typeof payload.clientName !== "string" || payload.clientName.trim() === "") {
    return ["clientName debe ser un texto válido"];
  }
  if (typeof payload.clientEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.clientEmail)) {
    return ["clientEmail debe tener formato válido"];
  }
  if (typeof payload.date !== "string" || payload.date.trim() === "") {
    return ["date es obligatorio"];
  }
  if (typeof payload.time !== "string" || payload.time.trim() === "") {
    return ["time es obligatorio"];
  }
  if (typeof payload.status !== "string" || payload.status.trim() === "") {
    return ["status es obligatorio"];
  }

  return [];
}

class BookingService {
  async createBooking(payload) {
    const normalizedBooking = {
      ...payload,
      services: Array.isArray(payload.services) ? payload.services : [],
      status: payload.status || "pending",
    };
    const errors = validateBookingPayload(normalizedBooking);
    if (errors.length > 0) {
      throw new ServiceError(400, { error: "Datos inválidos", details: errors });
    }
    return bookingManager.createBooking(normalizedBooking);
  }

  async getBookingById(id) {
    const booking = await bookingManager.getBookingById(id);
    if (!booking) {
      throw new ServiceError(404, { error: "Reserva no encontrada" });
    }
    return booking;
  }

  async addServiceToBooking(bookingId, serviceId, quantity) {
    const booking = await bookingManager.getBookingById(bookingId);
    if (!booking) {
      throw new ServiceError(404, { error: "Reserva no encontrada" });
    }

    const service = await serviceManager.getServiceById(serviceId);
    if (!service) {
      throw new ServiceError(404, { error: "Servicio no encontrado" });
    }

    return bookingManager.addServiceToBooking(bookingId, serviceId, quantity);
  }
}

module.exports = new BookingService();