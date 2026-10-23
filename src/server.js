const app = require("./app");
const mongoose = require("mongoose");
const { validateEnv } = require("./config/env.config");

async function startServer() {
  validateEnv();
  await mongoose.connect(process.env.MONGO_URI);

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Servidor funcionando en http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("No se pudo iniciar la aplicación:", error.message);
  process.exit(1);
});
