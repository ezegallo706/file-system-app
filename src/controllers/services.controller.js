const path = require("path");
const ServiceManager = require("../managers/ServiceManager");

const serviceManager = new ServiceManager(path.join(__dirname, "../data/services.json"));

function validateServicePayload(payload) {
  const requiredFields = ["name", "description", "duration", "price", "category", "available"];
  const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === "");

  if (missing.length > 0) {
    return {
      valid: false,
      errors: [`Los campos obligatorios faltan: ${missing.join(", ")}`],
    };
  }

  if (typeof payload.name !== "string" || payload.name.trim() === "") {
    return { valid: false, errors: ["El campo name debe ser un texto válido"] };
  }

  if (typeof payload.description !== "string" || payload.description.trim() === "") {
    return { valid: false, errors: ["El campo description debe ser un texto válido"] };
  }

  if (!Number.isFinite(Number(payload.duration)) || Number(payload.duration) <= 0) {
    return { valid: false, errors: ["El campo duration debe ser un número positivo"] };
  }

  if (!Number.isFinite(Number(payload.price)) || Number(payload.price) < 0) {
    return { valid: false, errors: ["El campo price debe ser un número mayor o igual a 0"] };
  }

  if (typeof payload.category !== "string" || payload.category.trim() === "") {
    return { valid: false, errors: ["El campo category debe ser un texto válido"] };
  }

  if (typeof payload.available !== "boolean") {
    return { valid: false, errors: ["El campo available debe ser booleano"] };
  }

  return { valid: true, errors: [] };
}

async function getServices(req, res) {
  const services = await serviceManager.getServices();
  return res.status(200).json(services);
}

async function getServiceById(req, res) {
  const service = await serviceManager.getServiceById(req.params.sid);

  if (!service) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }

  return res.status(200).json(service);
}

async function createService(req, res) {
  const { id, ...serviceData } = req.body || {};
  const validation = validateServicePayload(serviceData);

  if (!validation.valid) {
    return res.status(400).json({ error: "Datos inválidos", details: validation.errors });
  }

  const service = await serviceManager.addService(serviceData);
  return res.status(201).json(service);
}

async function updateService(req, res) {
  const id = req.params.sid;
  const { id: ignoredId, ...serviceData } = req.body || {};
  const existingService = await serviceManager.getServiceById(id);

  if (!existingService) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }

  const mergedService = { ...existingService, ...serviceData };
  const validation = validateServicePayload(mergedService);

  if (!validation.valid) {
    return res.status(400).json({ error: "Datos inválidos", details: validation.errors });
  }

  const updatedService = await serviceManager.updateService(id, serviceData);
  return res.status(200).json(updatedService);
}

async function deleteService(req, res) {
  const deletedService = await serviceManager.deleteService(req.params.sid);

  if (!deletedService) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }

  return res.status(200).json({ message: "Servicio eliminado correctamente", deletedService });
}

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};