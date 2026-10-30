import { socketServer } from "../server.js"
import { ServicesService } from "../services/services.service.js"

const servicesService = new ServicesService()

export const getServices = async (req, res) => {

    try {

        const services = await servicesService.getServices()

        return res.status(200).json({
            status: "success",
            payload: services
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

        return res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}

export const createService = async (req, res) => {

    try {
        const service = await servicesService.createService(req.body)

        return res.status(201).json({
            status: "success",
            payload: service
        })

    } catch (error) {

        return res.status(400).json({
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

        return res.status(200).json({
            status: "success",
            payload: service
        })

    } catch (error) {

        return res.status(404).json({
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
            .then(data => {
                socketServer.emit("delete-service", data)
            })


        return res.status(200).json({
            status: "success",
            payload: service
        })

    } catch (error) {

        return res.status(404).json({
            status: "error",
            message: error.message
        })
    }
}
