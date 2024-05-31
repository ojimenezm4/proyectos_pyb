const express = require("express");
const routes = require("./routes");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: "variables.env" });
// Conectar a MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Crear el servidor
const app = express();

// Habilitar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (como las de recursos estáticos)
    if (!origin) {
      return callback(null, true);
    }

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

// Habilitar CORS con las opciones configuradas
app.use(cors(corsOptions));

// Rutas de la app
app.use("/", routes());

// Configurar carpeta pública para archivos subidos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//esto se hace siempre para desplegar los proyectos en heroku
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 5000;
// iniciarAPP
app.listen(port, host, () => {
  console.log("El servidor está funcionando ");
});
