const dotenv = require("dotenv");

dotenv.config();

const REQUIRED_ENV_VARS = ["MONGO_URI"];

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => {
    const value = process.env[key];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missing.length > 0) {
    const missingList = missing.join(", ");
    throw new Error(
      `Faltan variables de entorno requeridas: ${missingList}. Define estas variables en tu archivo .env antes de iniciar la aplicación.`
    );
  }

  process.env.PORT = process.env.PORT || "8080";
  return { ...process.env };
}

module.exports = {
  REQUIRED_ENV_VARS,
  validateEnv,
};
