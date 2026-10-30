import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    clientEmail: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    time: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    }
})

export const BookingModel = mongoose.model("booking", bookingSchema)