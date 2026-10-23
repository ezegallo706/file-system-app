const Service = require("../models/service.model");

class ServicesDAO {
  getAll() { return Service.find().lean(); }
  getById(id) { return Service.findById(id).lean(); }
  create(data) { return Service.create(data); }
  update(id, data) { return Service.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean(); }
  delete(id) { return Service.findByIdAndDelete(id).lean(); }
}

module.exports = ServicesDAO;