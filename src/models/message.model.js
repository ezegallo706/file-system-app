const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);