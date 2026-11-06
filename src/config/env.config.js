import dotenv from "dotenv"

dotenv.config()


export const envConfig = {
    port: Number.parseInt(process.env.PORT || "8080", 10),
    mongoUri: process.env.MONGO_URI
}
