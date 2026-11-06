const path = require("path");
const ServiceManager = require("../managers/ServiceManager");
const ServiceError = require("./ServiceError");

const serviceManager = new ServiceManager(path.join(__dirname, "../data/services.json"));

function validateServicePayload(payload) {
  const requiredFields = ["name", "description", "duration", "price", "category", "available"];
  const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === "");

  if (missing.length > 0) {
    return [`Los campos obligatorios faltan: ${missing.join(", ")}`];
  }
  if (typeof payload.name !== "string" || payload.name.trim() === "") {
    return ["El campo name debe ser un texto válido"];
  }
  if (typeof payload.description !== "string" || payload.description.trim() === "") {
    return ["El campo description debe ser un texto válido"];
  }
  if (!Number.isFinite(Number(payload.duration)) || Number(payload.duration) <= 0) {
    return ["El campo duration debe ser un número positivo"];
  }
  if (!Number.isFinite(Number(payload.price)) || Number(payload.price) < 0) {
    return ["El campo price debe ser un número mayor o igual a 0"];
  }
  if (typeof payload.category !== "string" || payload.category.trim() === "") {
    return ["El campo category debe ser un texto válido"];
  }
  if (typeof payload.available !== "boolean") {
    return ["El campo available debe ser booleano"];
  }

  return [];
}

function throwValidationError(payload) {
  const errors = validateServicePayload(payload);
  if (errors.length > 0) {
    throw new ServiceError(400, { error: "Datos inválidos", details: errors });
  }
}

class ServiceService {
  getServices() {
    return serviceManager.getServices();
  }

  getServiceById(id) {
    return serviceManager.getServiceById(id);
  }

  async createService(payload) {
    throwValidationError(payload);
    return serviceManager.addService(payload);
  }

  async updateService(id, payload) {
    const existingService = await serviceManager.getServiceById(id);
    if (!existingService) {
      throw new ServiceError(404, { error: "Servicio no encontrado" });
    }

    throwValidationError({ ...existingService, ...payload });
    return serviceManager.updateService(id, payload);
  }

  async deleteService(id) {
    const deletedService = await serviceManager.deleteService(id);
    if (!deletedService) {
      throw new ServiceError(404, { error: "Servicio no encontrado" });
    }
    return deletedService;
  }
}

module.exports = new ServiceService();