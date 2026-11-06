class BookingRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async findById(id) {
    const bookings = await this.dao.readAll();
    return bookings.find((booking) => Number(booking.id) === Number(id)) || null;
  }

  async create(bookingData) {
    const bookings = await this.dao.readAll();
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
    await this.dao.writeAll(bookings);
    return newBooking;
  }

  async update(id, bookingData) {
    const bookings = await this.dao.readAll();
    const index = bookings.findIndex((booking) => Number(booking.id) === Number(id));

    if (index === -1) {
      return null;
    }

    const updatedBooking = { ...bookings[index], ...bookingData, id: Number(id) };
    bookings[index] = updatedBooking;
    await this.dao.writeAll(bookings);
    return updatedBooking;
  }
}

module.exports = BookingRepository;