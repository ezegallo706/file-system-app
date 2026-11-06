import mongoose from "mongoose"
import { envConfig } from "./env.config.js"


export const connectDB = async () => {
   if (!envConfig.mongoUri) {
      throw new Error("Falta configurar MONGO_URI en el archivo .env")
   }

   await mongoose.connect(envConfig.mongoUri)
   console.log("MongoDB conectado")
}
