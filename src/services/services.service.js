import { ServicesRepository } from "../repositories/services.repository.js"

export class ServicesService {

    constructor(repository = new ServicesRepository()) {
        this.repository = repository
    }

    getServices(query) {
        return this.repository.getAll(query)
    }

    async getServiceById(id) {

        const service = await this.repository.getById(id)

        if (!service) {
            throw Object.assign(new Error("Servicio no encontrado"), { statusCode: 404 })
        }


        return service
    }

    async createService(data) {

        return this.repository.create(data)
    }

    async updateService(id, data) {

        const service = await this.repository.update(id, data)


        if (!service) {
            throw Object.assign(new Error("Servicio no encontrado"), { statusCode: 404 })
        }


        return service
    }

    async deleteService(id) {

        const service = await this.repository.delete(id)


        if (!service) {
            throw Object.assign(new Error("Servicio no encontrado"), { statusCode: 404 })
        }

        return service
    }
}
