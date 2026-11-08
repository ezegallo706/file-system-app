import { BookingModel } from "../models/booking.model.js";

export class BookingsDAO {
	async getAll({ status, page = 1, limit = 10 } = {}) {
		const filter = status ? { status } : {};
		const [bookings, totalResults] = await Promise.all([
			BookingModel.find(filter)
				.populate("services.service")
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.lean(),
			BookingModel.countDocuments(filter)
		]);
		const totalPages = Math.ceil(totalResults / limit);

		return {
			bookings,
			pagination: {
				totalResults,
				currentPage: page,
				limit,
				totalPages,
				hasPrevPage: page > 1,
				hasNextPage: page < totalPages
			}
		};
	}

	getById(id) {
		return BookingModel.findById(id).populate("services.service");
	}

	create(data) {
		return BookingModel.create(data);
	}

	async addService(bookingId, serviceId, quantity) {
		const incrementExisting = () => BookingModel.findOneAndUpdate(
			{ _id: bookingId, "services.service": serviceId },
			{ $inc: { "services.$.quantity": quantity } },
			{ new: true, runValidators: true }
		);

		let booking = await incrementExisting();
		if (!booking) {
			booking = await BookingModel.findOneAndUpdate(
				{ _id: bookingId, services: { $not: { $elemMatch: { service: serviceId } } } },
				{ $push: { services: { service: serviceId, quantity } } },
				{ new: true, runValidators: true }
			);
		}

		if (!booking) {
			booking = await incrementExisting();
		}

		return booking?.populate("services.service") ?? null;
	}
}
