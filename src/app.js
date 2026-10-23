const express = require("express");
const servicesRouter = require("./routes/services.router");
const bookingsRouter = require("./routes/bookings.router");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API del Sistema de Turnos y Reservas",
  });
});

app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

module.exports = app;
