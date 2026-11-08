import { ServicesService } from "../services/services.service.js"

const servicesService = new ServicesService()

export const getServices = async (req, res) => {

    try {

        const { services, pagination } = await servicesService.getServices(res.locals.servicesQuery)

        return res.status(200).json({
            status: "success",
            payload: services,
            pagination
        })

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}


export const getServiceById = async (req, res) => {

    try {

        const service = await servicesService.getServiceById(
            req.params.sid
        )

        return res.status(200).json({
            status: "success",
            payload: service
        })

    } catch (error) {

        return res.status(error.statusCode ?? 500).json({
            status: "error",
            message: error.message
        })
    }
}

export const createService = async (req, res) => {

    try {
        const service = await servicesService.createService(req.body)
        req.app.get("socketServer")?.emit("service-created", service)

        return res.status(201).json({
            status: "success",
            payload: service
        })

    } catch (error) {

        return res.status(error.statusCode ?? (error.name === "ValidationError" ? 400 : 500)).json({
            status: "error",
            message: error.message
        })
    }
}

export const updateService = async (req, res) => {

    try {

        const service = await servicesService.updateService(
            req.params.sid,
            req.body
        )
        req.app.get("socketServer")?.emit("service-updated", service)

        return res.status(200).json({
            status: "success",
            payload: service
        })

    } catch (error) {

        return res.status(error.statusCode ?? (error.name === "ValidationError" ? 400 : 500)).json({
            status: "error",
            message: error.message
        })
    }
}

export const deleteService = async (req, res) => {

    try {

        const service = await servicesService.deleteService(
            req.params.sid
        )
        req.app.get("socketServer")?.emit("delete-service", service)


        return res.status(200).json({
            status: "success",
            payload: service
        })

    } catch (error) {

        return res.status(error.statusCode ?? 500).json({
            status: "error",
            message: error.message
        })
    }
}
