const path = require("path");
const JsonFileDao = require("./dao/JsonFileDao");
const ServiceRepository = require("./repositories/ServiceRepository");
const BookingRepository = require("./repositories/BookingRepository");
const ServiceService = require("./services/ServiceService");
const BookingService = require("./services/BookingService");

const serviceDao = new JsonFileDao(path.join(__dirname, "data/services.json"));
const bookingDao = new JsonFileDao(path.join(__dirname, "data/bookings.json"));
const serviceRepository = new ServiceRepository(serviceDao);
const bookingRepository = new BookingRepository(bookingDao);

module.exports = {
  serviceService: new ServiceService(serviceRepository),
  bookingService: new BookingService(bookingRepository, serviceRepository),
};