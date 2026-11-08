import { ServicesRepository } from "../repositories/services.repository.js";
import { BookingsRepository } from "../repositories/bookings.repository.js";

const notFound = (message) => Object.assign(new Error(message), { statusCode: 404 });
const badRequest = (message) => Object.assign(new Error(message), { statusCode: 400 });

export class BookingsService {
	constructor(repository = new BookingsRepository(), servicesRepository = new ServicesRepository()) {
		this.repository = repository;
		this.servicesRepository = servicesRepository;
	}

	getBookings(query) {
		return this.repository.getAll(query);
	}

	async getBookingById(id) {
		const booking = await this.repository.getById(id);
		if (!booking) {
			throw notFound("Reserva no encontrada");
		}

		return booking;
	}

	createBooking(data) {
		return this.repository.create(data);
	}

	async addServiceToBooking(bookingId, serviceId, quantity) {
		const [booking, service] = await Promise.all([
			this.repository.getById(bookingId),
			this.servicesRepository.getById(serviceId)
		]);

		if (!booking) {
			throw notFound("Reserva no encontrada");
		}
		if (!service) {
			throw notFound("Servicio no encontrado");
		}
		if (!service.available) {
			throw badRequest("El servicio no está disponible");
		}

		const updatedBooking = await this.repository.addService(bookingId, serviceId, quantity);
		if (!updatedBooking) {
			throw notFound("Reserva no encontrada");
		}

		return updatedBooking;
	}
}
