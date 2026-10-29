const { ServicesService } = require("../services/services.service");

const servicesService = new ServicesService();

async function getServices(req, res, next) {
  try {
    const services = await servicesService.getServices();
    return res.status(200).json(services);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message, details: error.details });
    return next(error);
  }
}

async function getServiceById(req, res, next) {
  try {
    const service = await servicesService.getServiceById(req.params.sid);
    return res.status(200).json(service);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message, details: error.details });
    return next(error);
  }
}

async function createService(req, res, next) {
  try {
    const service = await servicesService.createService(req.body);
    return res.status(201).json(service);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message, details: error.details });
    return next(error);
  }
}

async function updateService(req, res, next) {
  try {
    const service = await servicesService.updateService(req.params.sid, req.body);
    return res.status(200).json(service);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message, details: error.details });
    return next(error);
  }
}

async function deleteService(req, res, next) {
  try {
    const deletedService = await servicesService.deleteService(req.params.sid);
    return res.status(200).json({ message: "Servicio eliminado correctamente", deletedService });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ error: error.message, details: error.details });
    return next(error);
  }
}

module.exports = { getServices, getServiceById, createService, updateService, deleteService };