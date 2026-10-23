const mongoose = require("mongoose");
const bookingsService = require("../services/bookings.service");
const servicesService = require("../services/services.service");

function validateBookingPayload(payload) {
  const requiredFields = ["clientName", "clientEmail", "date", "time", "status"];
  const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === "");
  if (missing.length) return { valid: false, errors: [`Los campos obligatorios faltan: ${missing.join(", ")}`] };
  if (typeof payload.clientName !== "string" || payload.clientName.trim() === "") return { valid: false, errors: ["clientName debe ser un texto válido"] };
  if (typeof payload.clientEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.clientEmail)) return { valid: false, errors: ["clientEmail debe tener formato válido"] };
  if (typeof payload.date !== "string" || payload.date.trim() === "") return { valid: false, errors: ["date es obligatorio"] };
  if (typeof payload.time !== "string" || payload.time.trim() === "") return { valid: false, errors: ["time es obligatorio"] };
  if (typeof payload.status !== "string" || payload.status.trim() === "") return { valid: false, errors: ["status es obligatorio"] };
  return { valid: true, errors: [] };
}

function handleError(next, error) { next(error); }

module.exports = {
  createBooking: async (req, res, next) => {
    try {
      const { id, _id, ...bookingData } = req.body || {};
      const normalizedBooking = {
        ...bookingData,
        services: Array.isArray(bookingData.services) ? bookingData.services : [],
        status: bookingData.status || "pending",
      };
      const validation = validateBookingPayload(normalizedBooking);
      if (!validation.valid) return res.status(400).json({ error: "Datos inválidos", details: validation.errors });
      return res.status(201).json(await bookingsService.createBooking(normalizedBooking));
    } catch (error) { return handleError(next, error); }
  },
  getBookingById: async (req, res, next) => {
    try {
      const booking = await bookingsService.getBookingById(req.params.bid);
      if (!booking) return res.status(404).json({ error: "Reserva no encontrada" });
      return res.status(200).json(booking);
    } catch (error) { return handleError(next, error); }
  },
  addServiceToBooking: async (req, res, next) => {
    try {
      const { bid, sid } = req.params;
      const booking = await bookingsService.getBookingById(bid);
      if (!booking) return res.status(404).json({ error: "Reserva no encontrada" });
      if (!mongoose.isValidObjectId(sid) || !(await servicesService.getServiceById(sid))) {
        return res.status(404).json({ error: "Servicio no encontrado" });
      }
      const updatedBooking = await bookingsService.addServiceToBooking(bid, sid, Number(req.body?.quantity ?? 1));
      return res.status(200).json(updatedBooking);
    } catch (error) { return handleError(next, error); }
  },
};