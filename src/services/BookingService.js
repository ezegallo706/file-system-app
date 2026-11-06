const ServiceError = require("./ServiceError");

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
  constructor(bookingRepository, serviceRepository) {
    this.bookingRepository = bookingRepository;
    this.serviceRepository = serviceRepository;
  }

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
    return this.bookingRepository.create(normalizedBooking);
  }

  async getBookingById(id) {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new ServiceError(404, { error: "Reserva no encontrada" });
    }
    return booking;
  }

  async addServiceToBooking(bookingId, serviceId, quantity) {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new ServiceError(404, { error: "Reserva no encontrada" });
    }

    const service = await this.serviceRepository.findById(serviceId);
    if (!service) {
      throw new ServiceError(404, { error: "Servicio no encontrado" });
    }

    const parsedQuantity = Number(quantity) > 0 ? Number(quantity) : 1;
    const bookingServices = Array.isArray(booking.services) ? booking.services : [];
    const existingServiceIndex = bookingServices.findIndex((item) => Number(item.service) === Number(serviceId));
    const updatedServices = existingServiceIndex !== -1
      ? bookingServices.map((item, index) => (
        index === existingServiceIndex
          ? { ...item, quantity: item.quantity + parsedQuantity }
          : item
      ))
      : [...bookingServices, { service: Number(serviceId), quantity: parsedQuantity }];

    return this.bookingRepository.update(bookingId, { services: updatedServices });
  }
}

module.exports = BookingService;