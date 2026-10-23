const servicesService = require("../services/services.service");

function validateServicePayload(payload) {
  const requiredFields = ["name", "description", "duration", "price", "category", "available"];
  const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === "");
  if (missing.length) return { valid: false, errors: [`Los campos obligatorios faltan: ${missing.join(", ")}`] };
  if (typeof payload.name !== "string" || payload.name.trim() === "") return { valid: false, errors: ["El campo name debe ser un texto válido"] };
  if (typeof payload.description !== "string" || payload.description.trim() === "") return { valid: false, errors: ["El campo description debe ser un texto válido"] };
  if (!Number.isFinite(Number(payload.duration)) || Number(payload.duration) <= 0) return { valid: false, errors: ["El campo duration debe ser un número positivo"] };
  if (!Number.isFinite(Number(payload.price)) || Number(payload.price) < 0) return { valid: false, errors: ["El campo price debe ser un número mayor o igual a 0"] };
  if (typeof payload.category !== "string" || payload.category.trim() === "") return { valid: false, errors: ["El campo category debe ser un texto válido"] };
  if (typeof payload.available !== "boolean") return { valid: false, errors: ["El campo available debe ser booleano"] };
  return { valid: true, errors: [] };
}

function handleError(next, error) { next(error); }

module.exports = {
  getServices: async (req, res, next) => {
    try { return res.status(200).json(await servicesService.getServices()); } catch (error) { return handleError(next, error); }
  },
  getServiceById: async (req, res, next) => {
    try {
      const service = await servicesService.getServiceById(req.params.sid);
      if (!service) return res.status(404).json({ error: "Servicio no encontrado" });
      return res.status(200).json(service);
    } catch (error) { return handleError(next, error); }
  },
  createService: async (req, res, next) => {
    try {
      const { id, _id, ...serviceData } = req.body || {};
      const validation = validateServicePayload(serviceData);
      if (!validation.valid) return res.status(400).json({ error: "Datos inválidos", details: validation.errors });
      return res.status(201).json(await servicesService.createService(serviceData));
    } catch (error) { return handleError(next, error); }
  },
  updateService: async (req, res, next) => {
    try {
      const { id, _id, ...serviceData } = req.body || {};
      const existingService = await servicesService.getServiceById(req.params.sid);
      if (!existingService) return res.status(404).json({ error: "Servicio no encontrado" });
      const validation = validateServicePayload({ ...existingService, ...serviceData });
      if (!validation.valid) return res.status(400).json({ error: "Datos inválidos", details: validation.errors });
      return res.status(200).json(await servicesService.updateService(req.params.sid, serviceData));
    } catch (error) { return handleError(next, error); }
  },
  deleteService: async (req, res, next) => {
    try {
      const deletedService = await servicesService.deleteService(req.params.sid);
      if (!deletedService) return res.status(404).json({ error: "Servicio no encontrado" });
      return res.status(200).json({ message: "Servicio eliminado correctamente", deletedService });
    } catch (error) { return handleError(next, error); }
  },
};