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
    },
    services: [{
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "services",
            required: true
        },
        quantity: {
            type: Number,
            min: 1,
            default: 1
        }
    }]
}, { timestamps: true })

export const BookingModel = mongoose.model("booking", bookingSchema)