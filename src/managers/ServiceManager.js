const fs = require("fs/promises");

class ServiceManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getServices() {
    const data = await fs.readFile(this.filePath, "utf-8");
    const parsed = JSON.parse(data || "[]");
    return Array.isArray(parsed) ? parsed : [];
  }

  async getServiceById(id) {
    const services = await this.getServices();
    return services.find((service) => Number(service.id) === Number(id)) || null;
  }

  async addService(serviceData) {
    const services = await this.getServices();
    const newId = services.length === 0 ? 1 : Math.max(...services.map((service) => Number(service.id))) + 1;
    const newService = {
      id: newId,
      ...serviceData,
    };

    services.push(newService);
    await fs.writeFile(this.filePath, JSON.stringify(services, null, 2));
    return newService;
  }

  async updateService(id, serviceData) {
    const services = await this.getServices();
    const index = services.findIndex((service) => Number(service.id) === Number(id));

    if (index === -1) {
      return null;
    }

    const updatedService = {
      ...services[index],
      ...serviceData,
      id: Number(id),
    };

    services[index] = updatedService;
    await fs.writeFile(this.filePath, JSON.stringify(services, null, 2));
    return updatedService;
  }

  async deleteService(id) {
    const services = await this.getServices();
    const index = services.findIndex((service) => Number(service.id) === Number(id));

    if (index === -1) {
      return null;
    }

    const [deletedService] = services.splice(index, 1);
    await fs.writeFile(this.filePath, JSON.stringify(services, null, 2));
    return deletedService;
  }
}

module.exports = ServiceManager;
