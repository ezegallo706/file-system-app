const ServicesRepository = require("../repositories/services.repository");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

class ServicesService {
  constructor(repository = new ServicesRepository()) {
    this.repository = repository;
  }

  getServices() {
    return this.repository.getAll();
  }

  async getAvailableServices() {
    const services = await this.repository.getAll();
    return services.filter((service) => service.available);
  }

  async getServiceById(id) {
    const service = await this.repository.getById(id);
    if (!service) throw createError("Servicio no encontrado", 404);
    return service;
  }

  async createService(data) {
    const { name, description, duration, price, category, available } = data || {};

    if (!name || !description || !duration || price === undefined || !category || available === undefined) {
      throw createError("Faltan campos obligatorios", 400);
    }

    if (price < 0) throw createError("El precio no puede ser negativo", 400);

    return this.repository.create({
      name,
      description,
      duration: Number(duration),
      price: Number(price),
      category,
      available,
    });
  }

  async updateService(id, data) {
    const service = await this.repository.update(id, data || {});
    if (!service) throw createError("Servicio no encontrado", 404);
    return service;
  }

  async deleteService(id) {
    const service = await this.repository.delete(id);
    if (!service) throw createError("Servicio no encontrado", 404);
    return service;
  }
}

module.exports = { ServicesService };