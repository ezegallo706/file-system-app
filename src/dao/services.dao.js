const path = require("path");
const JsonFileDAO = require("./jsonFile.dao");

class ServicesDAO {
  constructor(fileStore = new JsonFileDAO(path.join(__dirname, "../data/services.json"))) {
    this.fileStore = fileStore;
  }

  async getAll() {
    return this.fileStore.readAll();
  }

  async getById(id) {
    const services = await this.getAll();
    return services.find((service) => Number(service.id) === Number(id)) || null;
  }

  async create(data) {
    const services = await this.getAll();
    const ids = services.map((service) => Number(service.id)).filter(Number.isFinite);
    const newService = { id: ids.length ? Math.max(...ids) + 1 : 1, ...data };
    services.push(newService);
    await this.fileStore.writeAll(services);
    return newService;
  }

  async update(id, data) {
    const services = await this.getAll();
    const index = services.findIndex((service) => Number(service.id) === Number(id));
    if (index === -1) return null;

    services[index] = { ...services[index], ...data, id: services[index].id };
    await this.fileStore.writeAll(services);
    return services[index];
  }

  async delete(id) {
    const services = await this.getAll();
    const index = services.findIndex((service) => Number(service.id) === Number(id));
    if (index === -1) return null;

    const [deletedService] = services.splice(index, 1);
    await this.fileStore.writeAll(services);
    return deletedService;
  }
}

module.exports = ServicesDAO;