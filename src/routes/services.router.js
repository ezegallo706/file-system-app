const express = require("express");
const servicesController = require("../controllers/services.controller");

const router = express.Router();
router.get("/", servicesController.getServices);
router.get("/:sid", servicesController.getServiceById);
router.post("/", servicesController.createService);
router.put("/:sid", servicesController.updateService);
router.delete("/:sid", servicesController.deleteService);

module.exports = router;
