import { ServiceModel } from "../models/services.models.js";
export class ServicesDAO {

    async getAll() {

        const services = await ServiceModel.find().lean()
        return services
    }

    async getById(id) {

        const service = await ServiceModel.findById(id)

        return service
    }


    async create(data) {

        const newService = await ServiceModel.create(data)


        return newService
    }


    async update(id, data) {

        const service = await ServiceModel.findByIdAndUpdate(id, data, { new: true })


        return service
    }


    async delete(id) {

        const service = await ServiceModel.findByIdAndDelete(id)

        return service
    }
}
