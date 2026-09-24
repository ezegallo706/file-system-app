const fs = require("fs/promises");

class BookingManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async createBooking(bookingData) {
    const data = await fs.readFile(this.filePath, "utf-8");
    const bookings = JSON.parse(data || "[]");
    const newId = bookings.length === 0 ? 1 : Math.max(...bookings.map((booking) => Number(booking.id))) + 1;
    const newBooking = {
      id: newId,
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status || "pending",
      services: Array.isArray(bookingData.services) ? bookingData.services : [],
    };

    bookings.push(newBooking);
    await fs.writeFile(this.filePath, JSON.stringify(bookings, null, 2));
    return newBooking;
  }

  async getBookingById(id) {
    const data = await fs.readFile(this.filePath, "utf-8");
    const bookings = JSON.parse(data || "[]");
    return bookings.find((booking) => Number(booking.id) === Number(id)) || null;
  }

  async addServiceToBooking(bookingId, serviceId, quantity = 1) {
    const data = await fs.readFile(this.filePath, "utf-8");
    const bookings = JSON.parse(data || "[]");
    const bookingIndex = bookings.findIndex((booking) => Number(booking.id) === Number(bookingId));

    if (bookingIndex === -1) {
      return null;
    }

    const booking = bookings[bookingIndex];
    const parsedQuantity = Number(quantity) > 0 ? Number(quantity) : 1;
    const existingService = booking.services.find((item) => Number(item.service) === Number(serviceId));

    if (existingService) {
      existingService.quantity += parsedQuantity;
    } else {
      booking.services.push({ service: Number(serviceId), quantity: parsedQuantity });
    }

    await fs.writeFile(this.filePath, JSON.stringify(bookings, null, 2));
    return booking;
  }
}

module.exports = BookingManager;
