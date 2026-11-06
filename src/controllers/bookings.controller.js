import mongoose from "mongoose";
import { BookingModel } from "../models/booking.model.js";
import { ServiceModel } from "../models/services.models.js";

class BookingController {
	async getBookingById(req, res) {
		const { bid } = req.params;

		if (!mongoose.isValidObjectId(bid)) {
			return res.status(400).json({ status: "error", message: "ID de reserva inválido" });
		}

		try {
			const booking = await BookingModel.findById(bid).populate("services.service");

			if (!booking) {
				return res.status(404).json({ status: "error", message: "Reserva no encontrada" });
			}

			return res.status(200).json({ status: "success", payload: booking });
		} catch (error) {
			return res.status(500).json({ status: "error", message: error.message });
		}
	}

	async createBooking(req, res) {
		const { clientName, clientEmail, date, time } = req.body;

		if (
			typeof clientName !== "string" ||
			!clientName.trim() ||
			typeof clientEmail !== "string" ||
			!clientEmail.trim()
		) {
			return res.status(400).json({
				status: "error",
				message: "El nombre y el email del cliente son obligatorios"
			});
		}

		try {
			const booking = await BookingModel.create({
				clientName: clientName.trim(),
				clientEmail: clientEmail.trim(),
				...(date && { date }),
				...(time && { time })
			});

			return res.status(201).json({ status: "success", payload: booking });
		} catch (error) {
			const statusCode = error.name === "ValidationError" ? 400 : 500;
			return res.status(statusCode).json({ status: "error", message: error.message });
		}
	}

	async addServiceToBooking(req, res) {
		const { bid, sid } = req.params;
		const quantity = req.body.quantity === undefined ? 1 : Number(req.body.quantity);

		if (!mongoose.isValidObjectId(bid) || !mongoose.isValidObjectId(sid)) {
			return res.status(400).json({ status: "error", message: "ID de reserva o servicio inválido" });
		}

		if (!Number.isInteger(quantity) || quantity < 1) {
			return res.status(400).json({ status: "error", message: "La cantidad debe ser un entero mayor a cero" });
		}

		try {
			const booking = await BookingModel.findById(bid);
			if (!booking) {
				return res.status(404).json({ status: "error", message: "Reserva no encontrada" });
			}

			const service = await ServiceModel.findById(sid);
			if (!service) {
				return res.status(404).json({ status: "error", message: "Servicio no encontrado" });
			}

			if (!service.available) {
				return res.status(400).json({ status: "error", message: "El servicio no está disponible" });
			}

			const existingService = booking.services.find((item) => item.service.toString() === sid);
			if (existingService) {
				existingService.quantity += quantity;
			} else {
				booking.services.push({ service: service._id, quantity });
			}

			await booking.save();
			await booking.populate("services.service");

			return res.status(200).json({ status: "success", payload: booking });
		} catch (error) {
			const statusCode = error.name === "ValidationError" ? 400 : 500;
			return res.status(statusCode).json({ status: "error", message: error.message });
		}
	}
}

export default BookingController;