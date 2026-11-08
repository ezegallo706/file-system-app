import { BookingsDAO } from "../dao/bookings.dao.js";

export class BookingsRepository {
	constructor(dao = new BookingsDAO()) {
		this.dao = dao;
	}

	getAll(options) {
		return this.dao.getAll(options);
	}

	getById(id) {
		return this.dao.getById(id);
	}

	create(data) {
		return this.dao.create(data);
	}

	addService(bookingId, serviceId, quantity) {
		return this.dao.addService(bookingId, serviceId, quantity);
	}
}
