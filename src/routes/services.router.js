import { Router } from "express"

import {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} from "../controllers/services.controller.js"
import { validateBody, validateServicesQuery, createServiceSchema, updateServiceSchema } from "../middlewares/validate.js"


const router = Router()


router.get("/", validateServicesQuery, getServices)

router.get("/:sid", getServiceById)

router.post("/", validateBody(createServiceSchema), createService)

router.put("/:sid", validateBody(updateServiceSchema), updateService)

router.delete("/:sid", deleteService)


export default router
