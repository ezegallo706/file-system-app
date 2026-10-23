const mongoose = require("mongoose");
const ServicesRepository = require("../repositories/services.repository");

class ServicesService {
  constructor(repository = new ServicesRepository()) { this.repository = repository; }
  getServices() { return this.repository.getAll(); }
  getServiceById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    return this.repository.getById(id);
  }
  createService(data) { return this.repository.create(data); }
  updateService(id, data) {
    if (!mongoose.isValidObjectId(id)) return null;
    return this.repository.update(id, data);
  }
  deleteService(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    return this.repository.delete(id);
  }
}

module.exports = new ServicesService();