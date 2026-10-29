const express = require("express");
const { validateEnv } = require("./config/env.config");
const servicesRouter = require("./routes/services.router");
const bookingsRouter = require("./routes/bookings.router");

validateEnv();

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
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const response = { error: statusCode === 500 ? "Error interno del servidor" : err.message };
  if (err.details) response.details = err.details;
  res.status(statusCode).json(response);
});

module.exports = app;
