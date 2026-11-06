import { ServiceModel } from "../models/services.models.js";
export class ServicesDAO {

    async getAll({
        category,
        available,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "asc"
    } = {}) {
        const filter = {
            ...(category && { category }),
            ...(available !== undefined && { available })
        }
        const sortDirection = order === "desc" ? -1 : 1
        const [services, totalResults] = await Promise.all([
            ServiceModel.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            ServiceModel.countDocuments(filter)
        ])
        const totalPages = Math.ceil(totalResults / limit)

        return {
            services,
            pagination: {
                totalResults,
                currentPage: page,
                limit,
                totalPages,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages
            }
        }
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
