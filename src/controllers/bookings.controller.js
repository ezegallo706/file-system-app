import { BookingsService } from "../services/bookings.service.js";

const bookingsService = new BookingsService();

export const getBookings = async (req, res) => {
	try {
		const { bookings, pagination } = await bookingsService.getBookings(res.locals.bookingsQuery);
		return res.status(200).json({ status: "success", payload: bookings, pagination });
	} catch (error) {
		return res.status(500).json({ status: "error", message: error.message });
	}
};

export const getBookingById = async (req, res) => {
	try {
		const booking = await bookingsService.getBookingById(req.params.bid);
		return res.status(200).json({ status: "success", payload: booking });
	} catch (error) {
		return res.status(error.statusCode ?? 500).json({ status: "error", message: error.message });
	}
};

export const createBooking = async (req, res) => {
	try {
		const booking = await bookingsService.createBooking(req.body);
		return res.status(201).json({ status: "success", payload: booking });
	} catch (error) {
		return res.status(error.name === "ValidationError" ? 400 : 500)
			.json({ status: "error", message: error.message });
	}
};

export const addServiceToBooking = async (req, res) => {
	try {
		const booking = await bookingsService.addServiceToBooking(
			req.params.bid,
			req.params.sid,
			req.body.quantity
		);
		return res.status(200).json({ status: "success", payload: booking });
	} catch (error) {
		return res.status(error.statusCode ?? (error.name === "ValidationError" ? 400 : 500))
			.json({ status: "error", message: error.message });
	}
};
