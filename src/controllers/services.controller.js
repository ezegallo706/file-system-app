const { serviceService } = require("../container");
const asyncHandler = require("./asyncHandler");

module.exports = {
  getServices: asyncHandler(async (req, res) => {
    const services = await serviceService.getServices();
    return res.status(200).json(services);
  }),

  getServiceById: asyncHandler(async (req, res) => {
    const service = await serviceService.getServiceById(req.params.sid);
    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }
    return res.status(200).json(service);
  }),

  createService: asyncHandler(async (req, res) => {
    const { id, ...serviceData } = req.body || {};
    const service = await serviceService.createService(serviceData);
    return res.status(201).json(service);
  }),

  updateService: asyncHandler(async (req, res) => {
    const { id: ignoredId, ...serviceData } = req.body || {};
    const updatedService = await serviceService.updateService(req.params.sid, serviceData);
    return res.status(200).json(updatedService);
  }),

  deleteService: asyncHandler(async (req, res) => {
    const deletedService = await serviceService.deleteService(req.params.sid);
    return res.status(200).json({ message: "Servicio eliminado correctamente", deletedService });
  }),
};