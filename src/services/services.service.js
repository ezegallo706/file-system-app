import { ServicesRepository } from "../repositories/services.repository.js"

export class ServicesService {

    constructor(repository = new ServicesRepository()) {
        this.repository = repository
    }

    getServices() {
        return this.repository.getAll()
    }

    async getServiceById(id) {

        const service = await this.repository.getById(id)

        if (!service) {
            throw new Error("Servicio no encontrado")
        }


        return service
    }

    async createService(data) {

        const { name, description, duration, price, category } = data

        if (!name || !description || !duration || price === undefined || !category) {
            throw new Error("Faltan campos obligatorios")
        }

        if (price < 0) {
            throw new Error("El precio no puede ser negativo")
        }

        return this.repository.create({
            name,
            description,
            duration,
            price,
            category
        })
    }

    async updateService(id, data) {

        const service = await this.repository.update(id, data)


        if (!service) {
            throw new Error("Servicio no encontrado")
        }


        return service
    }

    async deleteService(id) {

        const service = await this.repository.delete(id)


        if (!service) {
            throw new Error("Servicio no encontrado")
        }

        return service
    }
}
