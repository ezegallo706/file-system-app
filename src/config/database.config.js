import mongoose from "mongoose"
import { envConfig } from "./env.config.js"


export const connectDB = async () => {
     try {
        mongoose.connect(envConfig.mongoUri)
        console.log("MongoDB connectado")
     } catch (error) {
        console.error("Error al conectarse a MongoDB", error)
        process.exit(1)
     }
}
