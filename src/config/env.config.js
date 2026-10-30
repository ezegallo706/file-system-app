import dotenv from "dotenv"

dotenv.config()


export const envConfig = {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI
}
