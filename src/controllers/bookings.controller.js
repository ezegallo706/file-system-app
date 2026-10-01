const path = require("path");
const BookingManager = require("../managers/BookingManager");
const ServiceManager = require("../managers/ServiceManager");

const bookingManager = new BookingManager(path.join(__dirname, "../data/bookings.json"));
const serviceManager = new ServiceManager(path.join(__dirname, "../data/services.json"));

function validateBookingPayload(payload) {
  const requiredFields = ["clientName", "clientEmail", "date", "time", "status"];
  const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === "");

  if (missing.length > 0) {
    return {
      valid: false,
      errors: [`Los campos obligatorios faltan: ${missing.join(", ")}`],
    };
  }

  if (typeof payload.clientName !== "string" || payload.clientName.trim() === "") {
    return { valid: false, errors: ["clientName debe ser un texto válido"] };
  }

  if (typeof payload.clientEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.clientEmail)) {
    return { valid: false, errors: ["clientEmail debe tener formato válido"] };
  }

  if (typeof payload.date !== "string" || payload.date.trim() === "") {
    return { valid: false, errors: ["date es obligatorio"] };
  }

  if (typeof payload.time !== "string" || payload.time.trim() === "") {
    return { valid: false, errors: ["time es obligatorio"] };
  }

  if (typeof payload.status !== "string" || payload.status.trim() === "") {
    return { valid: false, errors: ["status es obligatorio"] };
  }

  return { valid: true, errors: [] };
}

async function createBooking(req, res) {
  const { id, ...bookingData } = req.body || {};
  const normalizedBooking = {
    ...bookingData,
    services: Array.isArray(bookingData.services) ? bookingData.services : [],
    status: bookingData.status || "pending",
  };
  const validation = validateBookingPayload(normalizedBooking);

  if (!validation.valid) {
    return res.status(400).json({ error: "Datos inválidos", details: validation.errors });
  }

  const booking = await bookingManager.createBooking(normalizedBooking);
  return res.status(201).json(booking);
}

async function getBookingById(req, res) {
  const booking = await bookingManager.getBookingById(req.params.bid);

  if (!booking) {
    return res.status(404).json({ error: "Reserva no encontrada" });
  }

  return res.status(200).json(booking);
}

async function addServiceToBooking(req, res) {
  const { bid, sid } = req.params;
  const booking = await bookingManager.getBookingById(bid);

  if (!booking) {
    return res.status(404).json({ error: "Reserva no encontrada" });
  }

  const service = await serviceManager.getServiceById(sid);
  if (!service) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }

  const quantity = Number(req.body?.quantity ?? 1);
  const updatedBooking = await bookingManager.addServiceToBooking(bid, sid, quantity);
  return res.status(200).json(updatedBooking);
}

module.exports = {
  createBooking,
  getBookingById,
  addServiceToBooking,
};