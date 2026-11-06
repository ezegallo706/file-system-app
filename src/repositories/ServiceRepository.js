class ServiceRepository {
  constructor(dao) {
    this.dao = dao;
  }

  findAll() {
    return this.dao.readAll();
  }

  async findById(id) {
    const services = await this.dao.readAll();
    return services.find((service) => Number(service.id) === Number(id)) || null;
  }

  async create(serviceData) {
    const services = await this.dao.readAll();
    const newId = services.length === 0 ? 1 : Math.max(...services.map((service) => Number(service.id))) + 1;
    const newService = { id: newId, ...serviceData };

    services.push(newService);
    await this.dao.writeAll(services);
    return newService;
  }

  async update(id, serviceData) {
    const services = await this.dao.readAll();
    const index = services.findIndex((service) => Number(service.id) === Number(id));

    if (index === -1) {
      return null;
    }

    const updatedService = { ...services[index], ...serviceData, id: Number(id) };
    services[index] = updatedService;
    await this.dao.writeAll(services);
    return updatedService;
  }

  async delete(id) {
    const services = await this.dao.readAll();
    const index = services.findIndex((service) => Number(service.id) === Number(id));

    if (index === -1) {
      return null;
    }

    const [deletedService] = services.splice(index, 1);
    await this.dao.writeAll(services);
    return deletedService;
  }
}

module.exports = ServiceRepository;